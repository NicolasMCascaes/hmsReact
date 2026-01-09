const bloodGroups: Record<string, string> = {
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-',
};
const bloodGroup = [
  { value: 'A_POSITIVE', label: 'A+' },
  { value: 'A_NEGATIVE', label: 'A-' },
  { value: 'B_POSITIVE', label: 'B+' },
  { value: 'B_NEGATIVE', label: 'B-' },
  { value: 'AB_POSITIVE', label: 'AB+' },
  { value: 'AB_NEGATIVE', label: 'AB-' },
  { value: 'O_POSITIVE', label: 'O+' },
  { value: 'O_NEGATIVE', label: 'O-' },
];
const appointmentReasons = [
  'Consulta de rotina',
  'Retorno médico',
  'Sintomas de gripe',
  'Acompanhamento de condição crônica',
  'Discussão de resultados de exames',
  'Renovação de receita médica',
  'Vacinação',
  'Avaliação de lesão',
  'Saúde mental / Psicologia',
  'Encaminhamento para especialista',
  'Verificação da pressão arterial',
  'Acompanhamento de diabetes',
  'Consulta de pré-natal',
  'Problemas de pele',
  'Alergias'
];

export {bloodGroups, bloodGroup, appointmentReasons}