import NextAuth from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongoose'
import User from '@/models/user'

export const authOptions = {
    providers: [
        CredentialProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {
                const { email, password } = credentials

                await connectDB()

                const user = await User.findOne({ email })

                if (!user) {
                    throw new Error('No user found')
                }

                const isValid = await bcrypt.compare(password, user.password)

                if (!isValid) {
                    throw new Error('Invalid password')
                }

                return { email: user.email }

            }
        })
    ],
    session: {
        jwt: true
    },
    pages: {
        signIn: '/auth/signin',
    },
    secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions);