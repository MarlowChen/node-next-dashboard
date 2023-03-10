import axios from 'axios'
import Router from 'next/router'
import { Cookies } from 'react-cookie'
import { getCookies } from 'cookies-next';

// set up cookies
const cookies = new Cookies()

export const handleAuthSSR = async (localPermissions) => {

    const { token } = getCookies("token")
    console.log(getCookies())
    const url = `${window.location.origin}/api/auth/validate`

    const redirectOnError = () => {
        /* eslint-disable no-console */
        console.log('Redirecting back to main page')
        if (typeof window !== 'undefined') {
            window.location.href = `${window.location.origin}/login`
            //Router.push('/login')
        }
        return {}
    }
    let permissions = [];
    try {
        if (!token) {
            return redirectOnError()
        }


        if (localPermissions && localPermissions.length > 0) {
            permissions = localPermissions;
            return;
        }
        const response = await axios.get(url, {
            headers: { Authorization: decodeURI(token) },
        })

        // if (response.data && response.data.length <= 0) {
        //     return redirectOnError()
        // }

        permissions = response.data;
    } catch (error) {
        /* eslint-disable no-console */
        console.log('Error: ', error)
        // Implementation or Network error
        return redirectOnError()
    }
    //驗證過關後才可以使用api
    // const userRequest = axios.create({
    //     baseURL: BASE_URL,
    //     headers: { Authorization: token },
    // });

    return { permissions, token }
}

export const login = async ({ token }) => {
    // Cookie will expire after 24h
    cookies.set('token', token, { maxAge: 60 * 60 * 24 })
}

export const logout = () => {
    cookies.remove('token')
}