import * as React from 'react';
import { useForm } from '@inertiajs/react';
import { Head, Link as InertiaLink } from '@inertiajs/react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton  from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GuestLayout from '@/Layouts/GuestLayout';
import TextField from '@mui/material/TextField';
export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = React.useState(false);

    const handlePasswordToggle = () => {
        setShowPassword((prev) => !prev);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
 
    <GuestLayout>
            <Head title="Log in" />
            <Stack spacing={4}>
                <Stack spacing={1}>
                    <Typography variant="h4">Sign in</Typography>
                    <Typography color="text.secondary" variant="body2">
                        Don&apos;t have an account?{' '}
                        <InertiaLink href={route('register')} style={{ textDecoration: 'none' }}>
                            <Button variant="text">Sign up</Button>
                        </InertiaLink>
                    </Typography>
                </Stack>
                <form onSubmit={submit}>
                    <Stack spacing={2}>
                    <TextField
                        id="email"
                        type="email"
                        name="email"
                        label="Email address"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        />

                    <TextField
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    label="Password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                    InputProps={{
                        endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                            edge="end"
                            onClick={handlePasswordToggle}
                            >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                        </InputAdornment>
                        ),
                    }}
                    />
                        <div>
                            {canResetPassword && (
                                <InertiaLink href={route('password.request')}>
                                    <Button variant="text">Forgot your password?</Button>
                                </InertiaLink>
                            )}
                        </div>
                        {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
                        <Button disabled={processing} type="submit" variant="contained">
                            Sign in
                        </Button>
                    </Stack>
                </form>
                {status && <Alert severity="success">{status}</Alert>}
            </Stack>
            </GuestLayout>
    );
}
