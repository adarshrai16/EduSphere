import { clerkClient, getAuth } from '@clerk/express'
import User from '../models/User.js'

export const getRequestUserId = (req) => {
    if (typeof req.auth === 'function') {
        const auth = req.auth()
        if (auth?.userId) return auth.userId
    }

    try {
        const auth = getAuth(req)
        if (auth?.userId) return auth.userId
    } catch (_) {
        // clerkMiddleware may not have run
    }

    return req.auth?.userId || null
}

export const getOrCreateUser = async (userId) => {
    if (!userId) return null

    let user = await User.findById(userId)
    if (user) return user

    const clerkUser = await clerkClient.users.getUser(userId)
    const email = clerkUser.emailAddresses?.[0]?.emailAddress || ''
    const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User'

    user = await User.findByIdAndUpdate(
        clerkUser.id,
        {
            $setOnInsert: {
                email,
                name,
                imageUrl: clerkUser.imageUrl,
            },
        },
        { upsert: true, new: true, runValidators: true }
    )

    return user
}
