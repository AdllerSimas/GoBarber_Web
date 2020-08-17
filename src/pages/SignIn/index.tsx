import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

//Using Context API
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import { Container, Content, Background, AnimationContainer } from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';


interface SignInFormData {
    email: string,
    password: string,
}

const SignIn: React.FC = () => {

    const formRef = useRef<FormHandles>(null);
    

    const { signIn } = useAuth();

    const { addToast } = useToast();

    const history = useHistory();

    const handleSubmit = useCallback(async (data: SignInFormData) => {
        
        try {

            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                email: Yup.string().required('E-mail Obrigatório!').email('Digite um email válido!'),
                password: Yup.string().min(6, 'Senha Obrigatória!'),
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            await signIn({
                email: data.email,
                password: data.password,
            });

            console.log('chegou!!!!');
            history.push('/dashboard');

        } catch (err) {
            
            if (err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err);

                formRef.current?.setErrors(errors);

                return;
            }
            
            addToast({
                type: 'error',
                title: 'Erro na Autenticação!',
                description: 'Erro ao fazer login, cheque as credenciais!'
            });
        }
    },[ signIn, addToast ]);
    
    return ( 
        <>
        <Container>
        
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber"/>
                    
                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Faça seu logon</h1>
                        <Input icon={FiMail} name="email" placeholder="E-mail"/>
                        <Input icon={FiLock} name="password" placeholder="Senha"/>
                        <Button type="submit">Entrar</Button>

                        <Link to='/forgot-password'>Esqueci minha senha</Link> 
                    </Form>
                    
                    <Link to="/signup">
                        <FiLogIn/>
                        Criar conta
                    </Link>
                </AnimationContainer>
            </Content>
            
            <Background/>
        
        </Container>
        </>
    );
};

export default SignIn;