import { Button, PasswordInput, SegmentedControl, TextInput } from "@mantine/core"
import { IconHeartbeat } from "@tabler/icons-react"
import { useForm } from '@mantine/form';
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/UserService";
import {errorNotification, sucessNotification} from "../utilities/NotificationUtility"
import { useState } from "react";


const RegisterPage = () => {
    const navigate = useNavigate();
    const[loading, setLoading] = useState(false)
    const form = useForm({
        initialValues: {
            role: 'PATIENT',
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validate: {
            name: (value) => (!value ? "O campo nome é obrigatório!" : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email inválido'),
            password: (value) => (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(value) ? null : 'A senha deve ter de 8-15 caracteres, incluir letras maiúsculas e minúsculas, números e caracteres especiais'),
            confirmPassword: (value, values) => value === values.password ? null : "As senhas não correspondem"
        },
    });
    const handleSubmit = (values: typeof form.values) => {
        console.log(values)
        setLoading(true)
        registerUser(values).then((data)=>{
            console.log(data)
            sucessNotification("Registrado com sucesso!")
            navigate("/login")
        }).catch((error)=>{
            console.log(error)
            errorNotification(error.response.data.errorMessage)
        }).finally(()=> setLoading(false))
    };
    return (
        <div style={{ background: 'url("/bg.jpg")' }} className='h-screen w-screen bg-cover! bg-center! bg-no-repeat! flex flex-col items-center justify-center'>
            <div className="absolute inset-0 bg-black/60"></div>
            <div className=' relative py-3 text-pink-400 flex gap-1 items-center'>
                <IconHeartbeat size={45} stroke={2.5} />
                <h2 className=' relative text-4xl font-semibold'>Pulse</h2>
            </div>
            <div className=" relative w-[450px] backdrop-blur-md p-10 py-8 rounded-xl">
                <form onSubmit={form.onSubmit(handleSubmit)} className=" relative flex flex-col gap-5! [&_input]: pl-2 [&_svg]: text-neutral-100">
                    <div className="self-center font-medium font-merriweather text-xl text-light">Cadastro</div>
                    <SegmentedControl {...form.getInputProps("role")} fullWidth size="md" color="pink" radius="md" data={[{ label: 'Paciente', value: 'PATIENT' }, { label: 'Médico', value: 'DOCTOR' }, { label: 'Admin', value: 'ADMIN' }]} />
                     <TextInput variant="unstyled" placeholder="Nome" radius="md" size="md"  {...form.getInputProps('name')} withAsterisk styles={{
                        input: {
                            color: '#f5f5f5',
                            border: '1px solid #aaa',
                            backgroundColor: 'transparent'
                        }
                    }} />
                    <TextInput variant="unstyled" placeholder="Email" radius="md" size="md"  {...form.getInputProps('email')} withAsterisk styles={{
                        input: {
                            color: '#f5f5f5',
                            border: '1px solid #aaa',
                            backgroundColor: 'transparent'
                        }
                    }} />
                    <PasswordInput placeholder="Senha" variant="unstyled" radius="md" size="md"  {...form.getInputProps('password')} withAsterisk styles={{
                        input: {
                            color: '#f5f5f5',
                            border: '1px solid #aaa',
                            backgroundColor: 'transparent',
                        }
                    }} />
                    <PasswordInput placeholder="Confirmar senha" variant="unstyled" radius="md" size="md"  {...form.getInputProps('confirmPassword')} withAsterisk styles={{
                        input: {
                            color: '#f5f5f5',
                            border: '1px solid #aaa',
                            backgroundColor: 'transparent',
                        }
                    }} />
                    <Button loading={loading} type="submit" color="pink">Cadastrar</Button>

                    <div className="self-center">Já possui uma conta? <Link className="hover:underline" to={"/login"}>Entrar!</Link></div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage