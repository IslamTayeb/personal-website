"use server";

import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (formData: FormData) => {
    // const email = formData.get("email");
    // const name = formData.get("name");
    // const text = formData.get("text");
    // const subject = formData.get("subject");

    console.log("Running on server")
    console.log(formData.get("name"));
    console.log(formData.get("email"));
    console.log(formData.get("subject"));
    console.log(formData.get("text"));
    
    // await resend.emails.send({
    //     from: "onboarding@resend.dev",
    //     subject: "subject as string",
    //     to: "imt11@duke.edu",
    //     // reply_to: email as string,
    //     text: "text as string"
    // });
}

