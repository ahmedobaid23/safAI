import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createUser, deleteUser } from '@/lib/users'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env')
  }

  const wh = new Webhook(SIGNING_SECRET)

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  const eventType = evt.type
  const { id } = evt.data
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`)

  if (eventType == 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data

    if (!id || !email_addresses || !first_name || !last_name) {
      console.error('Error: Missing user data');
      return new Response('Error: User creation failed', { status: 400 })
    }

    const user = await createUser({
      id, email: email_addresses[0].email_address, name: `${first_name} ${last_name}`
    })

    if (user) {
      console.log(`Created user with ID ${user.id}`)
      return new Response('User created succesfully', { status: 200 })
    } else {
      return new Response('Error: User creation failed', { status: 400 })
    }
  }

  if (eventType == 'user.deleted') {
    const { id } = evt.data

    if (!id) {
      return new Response('Error: Missing user data', { status: 400 })
    }

    const user = await deleteUser(id)

    if (user) {
      console.log(`Deleted user with ID ${user.id}`)
      return new Response('User deleted succesfully', { status: 200 })
    } else {
      return new Response('Error: User deletion failed', { status: 400 })
    }
  }

}