import { Button, PasswordInput, TextInput } from "@mantine/core"
import { IconHeartbeat } from "@tabler/icons-react"
import { useForm } from '@mantine/form';
import { Link } from "react-router-dom";


const LoginPage = () => {
    const form = useForm({
    initialValues: {
      email: '',
      password:'',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password:(value) => (!value?"Password is required!":null)
    },
  });
   const handleSubmit = (values: typeof form.values) => {
    console.log(values);
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
                    <div className="self-center font-medium font-merriweather text-xl text-light">Login</div>
                    <TextInput variant="unstyled" placeholder="Email" radius="md" size="md"  {...form.getInputProps('email')} withAsterisk styles={{
                        input:{
                            color: '#f5f5f5',
                            border: '1px solid #aaa',
                            backgroundColor: 'transparent'
                        }
                    }}/>
                    <PasswordInput placeholder="Password" variant="unstyled" radius="md" size="md"  {...form.getInputProps('password')} withAsterisk  styles={{
                        input:{
                            color:'#f5f5f5',
                            border:'1px solid #aaa',
                            backgroundColor:'transparent',
                        }
                    }} />
                    <Button type="submit" color="pink">Login</Button>
                    <div>Dont have an account? <Link to={"/register"}>Register</Link></div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage