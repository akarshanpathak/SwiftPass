import {Resend} from "resend"
import dotenv from "dotenv"

dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async ({email , subject , html}) =>{
    try {
        
        const {data , error} = await resend.emails.send({
            from : 'SwiftPass <onboarding@resend.dev>',
            to: [email],
            subject : subject,
            html:html
        })

        if(error){
            throw new Error(error.message)
        }

        return data;
    } catch (error) {
        console.error("Email error : " , error)
        throw new Error("Could not send verification email.");
    }
}

