package com.hms.VideoCallMS.api;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.VideoCallMS.dto.RoomStateDto;
import com.hms.VideoCallMS.dto.VideoCallEventDto;
import com.hms.VideoCallMS.dto.WebSocketClientMessageDto;
import com.hms.VideoCallMS.entity.CallEventType;
import com.hms.VideoCallMS.entity.ParticipantState;

@Component
public class HmsWebSocketHandler extends TextWebSocketHandler {

    private final Map<UUID, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final Map<Long, Map<UUID, ParticipantState>> callRoom = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;

    public HmsWebSocketHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("WebSocket connection established: " + session.getId());

        String profileId = session.getHandshakeHeaders().getFirst("X-Profile-Id");

        if (profileId != null) {
            sessions.put(UUID.fromString(profileId), session);
            System.out.println("Usuário conectado: " + profileId);
        }
    }

    public UUID getProfileIdFromSession(WebSocketSession session) {
        String profileId = session.getHandshakeHeaders().getFirst("X-Profile-Id");
        return UUID.fromString(profileId);
    }

    public void sendMessageToUser(UUID profileId, VideoCallEventDto event) {
        WebSocketSession session = sessions.get(profileId);

        if (session != null && session.isOpen()) {
            try {
                String json = objectMapper.writeValueAsString(event);
                session.sendMessage(new TextMessage(json));
            } catch (IOException e) {
                throw new RuntimeException("Erro ao enviar mensagem WebSocket", e);
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.entrySet().removeIf(entry -> entry.getValue().getId().equals(session.getId()));

        System.out.println("WebSocket disconnected: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        WebSocketClientMessageDto clientMessage = objectMapper.readValue(message.getPayload(),
                WebSocketClientMessageDto.class);
        switch (clientMessage.getType()) {
            case PARTICIPANT_JOINED -> handleParticipantJoined(session, clientMessage);
            case PARTICIPANT_LEFT -> handleParticipantLeft(session, clientMessage);
            case VIDEO_OFF -> handleVideoOff(clientMessage.getCallId(), getProfileIdFromSession(session));
            case VIDEO_ON -> handleVideoOn(clientMessage.getCallId(), getProfileIdFromSession(session));
            case AUDIO_OFF -> handleAudioOff(clientMessage.getCallId(), getProfileIdFromSession(session));
            case AUDIO_ON -> handleAudioOn(clientMessage.getCallId(), getProfileIdFromSession(session));
            case WEBRTC_ANSWER, WEBRTC_OFFER, ICE_CANDIDATE -> handleWebRtcSignal(session, clientMessage);
            default -> System.out.println("Evento desconhecido: " + clientMessage.getType());
        }
        System.out.println("Mensagem recebida: " + clientMessage.getType() + " - " + clientMessage.getMessage());
    }

    private void handleWebRtcSignal(WebSocketSession session, WebSocketClientMessageDto clientMessage) {
        Long callId = clientMessage.getCallId();
        UUID senderId = getProfileIdFromSession(session);

        VideoCallEventDto event = new VideoCallEventDto(clientMessage.getType(),
                "Sinal WebRTC de " + senderId, null, clientMessage.getData(), null);
        try {
            broadCastToCallExceptSender(callId, senderId, event);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao enviar mensagem WebSocket", e);
        }
    }

    public void broadCastToCallExceptSender(Long callId, UUID senderId, VideoCallEventDto event) throws IOException {
        Map<UUID, ParticipantState> participants = callRoom.get(callId);

        if (participants == null || participants.isEmpty()) {
            return;
        }

        String json = objectMapper.writeValueAsString(event);

        for (UUID participantId : participants.keySet()) {
            if (participantId.equals(senderId)) {
                continue;
            }

            WebSocketSession participantSession = sessions.get(participantId);

            if (participantSession != null && participantSession.isOpen()) {
                participantSession.sendMessage(new TextMessage(json));
            }
        }
    }

    private void handleParticipantLeft(WebSocketSession session, WebSocketClientMessageDto clientMessage)
            throws IOException {
        UUID profileId = getProfileIdFromSession(session);
        Long callId = clientMessage.getCallId();

        Map<UUID, ParticipantState> participants = callRoom.get(callId);
        if (participants != null) {
            participants.remove(profileId);
            System.out.println("Usuário " + profileId + " saiu da chamada " + callId);

            try {
                broadCastToCall(callId, new VideoCallEventDto(CallEventType.PARTICIPANT_LEFT,
                        "Usuário " + profileId + " saiu da chamada", null, null, profileId));
            } catch (IOException e) {
                throw new RuntimeException("Erro ao enviar mensagem WebSocket", e);
            }
        }
        sendRoomState(callId, null);
    }

    private void handleParticipantJoined(WebSocketSession session, WebSocketClientMessageDto clientMessage)
            throws IOException {
        UUID profileId = getProfileIdFromSession(session);
        Long callId = clientMessage.getCallId();

        callRoom.computeIfAbsent(callId, k -> new ConcurrentHashMap<>())
                .put(profileId, new ParticipantState(profileId, true, true, true));
        System.out.println("Usuário " + profileId + " entrou na chamada " + callId);

        broadCastToCall(callId, new VideoCallEventDto(CallEventType.PARTICIPANT_JOINED,
                "Usuário " + profileId + " entrou na chamada", null, null, profileId));
        sendRoomState(callId, true);
    }

    public void broadCastToCall(Long callId, VideoCallEventDto event) throws IOException {
        Map<UUID, ParticipantState> participants = callRoom.get(callId);
        if (participants == null || participants.isEmpty()) {
            return;
        }
        String json = objectMapper.writeValueAsString(event);
        for (UUID participantId : participants.keySet()) {
            WebSocketSession session = sessions.get(participantId);
            if (session != null && session.isOpen()) {
                session.sendMessage(new TextMessage(json));
            }
        }
    }

    private ParticipantState getParticipantState(Long callId, UUID participantId) {
        Map<UUID, ParticipantState> participants = callRoom.get(callId);
        if (participants == null) {
            return null;
        }
        return participants.get(participantId);
    }

    public void handleVideoOff(Long callId, UUID participantId) throws IOException {
        ParticipantState participantState = getParticipantState(callId, participantId);
        if (participantState != null) {
            participantState.setVideoEnabled(false);
            broadCastToCall(callId, new VideoCallEventDto(CallEventType.VIDEO_OFF,
                    "Usuário " + participantId + " desligou o vídeo", null, null, participantId));
        }
    }

    public void handleVideoOn(Long callId, UUID participantId) throws IOException {
        ParticipantState participantState = getParticipantState(callId, participantId);
        if (participantState != null) {
            participantState.setVideoEnabled(true);
            broadCastToCall(callId, new VideoCallEventDto(CallEventType.VIDEO_ON,
                    "Usuário " + participantId + " ligou o vídeo", null, null, participantId));
        }
    }

    public void handleAudioOff(Long callId, UUID participantId) throws IOException {
        ParticipantState participantState = getParticipantState(callId, participantId);
        if (participantState != null) {
            participantState.setAudioEnabled(false);
            broadCastToCall(callId, new VideoCallEventDto(CallEventType.AUDIO_OFF,
                    "Usuário " + participantId + " desligou o áudio", null, null, participantId));
        }
    }

    public void handleAudioOn(Long callId, UUID participantId) throws IOException {
        ParticipantState participantState = getParticipantState(callId, participantId);
        if (participantState != null) {
            participantState.setAudioEnabled(true);
            broadCastToCall(callId, new VideoCallEventDto(CallEventType.AUDIO_ON,
                    "Usuário " + participantId + " ligou o áudio", null, null, participantId));
        }
    }

    private void sendRoomState(Long callId, Boolean isActive) throws IOException {
        Map<UUID, ParticipantState> participants = callRoom.get(callId);

        int participantCount = participants == null ? 0 : participants.size();

        RoomStateDto roomStateDto = new RoomStateDto(
                callId,
                participantCount,
                participantCount >= 2, isActive);

        JsonNode data = objectMapper.valueToTree(roomStateDto);

        broadCastToCall(callId, new VideoCallEventDto(
                CallEventType.ROOM_STATE,
                "Estado atual da sala",
                null,
                data,
                null));
    }
}
