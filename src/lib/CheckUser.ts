import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export async function checkUser(){
    const user = await currentUser()

    if(!user){
        return null
    }

    try {
        const loggedIn = await db.user.findUnique({
            where: {
                clerkUserId: user.id
            }
        })

        if(loggedIn){
            return loggedIn
        }

        var name = `${user.firstName} ${user.lastName}`

        //create a new user in database
        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name,
                imageUrl: user.imageUrl,
                email: user.emailAddresses[0].emailAddress
            }
        })

        return newUser
        
    } catch (error: any) {
        console.log(error.message)
    }
}