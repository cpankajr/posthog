import React, { useState } from 'react'
import { toast } from 'react-toastify'
import api from 'lib/api'
import { Input, Button } from 'antd'
import { useActions, useValues } from 'kea'
import { userLogic } from 'scenes/userLogic'
import Form from 'antd/lib/form/Form'
import FormItem from 'antd/lib/form/FormItem'

export function ChangePassword(): JSX.Element {
    const { user } = useValues(userLogic)
    const { userUpdateSuccess } = useActions(userLogic)

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('')

    async function submit(): Promise<void> {
        try {
            userUpdateSuccess(await api.update('api/user/@me/change_password', {
                current_password: currentPassword,
                new_password: newPassword,
                new_password_repeat: newPasswordRepeat,
            }))
            toast.success('Password changed!')
            setCurrentPassword('')
            setNewPassword('')
            setNewPasswordRepeat('')
        } catch (response) {
            toast.error(response.detail)
        }
    }

    return (
        <Form
            onFinish={submit}
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
        >
            <FormItem
                label="Current Password"
                rules={[
                    {
                        required: !user || user.has_password,
                        message: 'Please input current password!',
                    },
                ]}
            >
                <Input.Password
                    name="currentPassword"
                    required
                    onChange={(event) => {
                        setCurrentPassword(event.target.value)
                    }}
                    value={currentPassword}
                    style={{ maxWidth: 400 }}
                    autoComplete="current-password"
                    disabled={!!user && !user.has_password}
                    placeholder={user && !user.has_password ? 'signed up with external login' : undefined}
                />
            </FormItem>
            <FormItem
                label="New Password"
                rules={[
                    {
                        required: true,
                        message: 'Please input new password!',
                    },
                ]}
            >
                <Input.Password
                    name="newPassword"
                    required
                    onChange={(event) => {
                        setNewPassword(event.target.value)
                    }}
                    value={newPassword}
                    style={{ maxWidth: 400 }}
                    autoComplete="new-password"
                />
            </FormItem>
            <FormItem
                label="Repeat New Password"
                rules={[
                    {
                        required: true,
                        message: 'Please input new password twice!',
                    },
                ]}
            >
                <Input.Password
                    name="newPasswordRepeat"
                    required
                    onChange={(event) => {
                        setNewPasswordRepeat(event.target.value)
                    }}
                    value={newPasswordRepeat}
                    style={{ maxWidth: 400 }}
                    autoComplete="new-password"
                />
            </FormItem>
            <FormItem>
                <Button type="primary" htmlType="submit">
                    Change Password
                </Button>
            </FormItem>
        </Form>
    )
}
