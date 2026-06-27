// src/app/api/webhook/clerk/route.ts
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // 1. Récupérer le secret du Webhook depuis l'environnement
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Veuillez ajouter le CLERK_WEBHOOK_SECRET dans votre fichier .env')
  }

  // 2. Récupérer les headers Svix pour la vérification
  const headerStore = await headers()
  const svix_id = headerStore.get("svix-id")
  const svix_timestamp = headerStore.get("svix-timestamp")
  const svix_signature = headerStore.get("svix-signature")

  // Si les headers sont manquants, on renvoie une erreur
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Erreur : Headers Svix manquants', {
      status: 400
    })
  }

  // 3. Récupérer le corps de la requête
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // 4. Créer une nouvelle instance de Webhook avec le secret
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // 5. Vérifier la validité de la signature
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Erreur : Signature non vérifiée :', err)
    return new Response('Erreur de vérification de la signature', {
      status: 400
    })
  }

  // 6. Traiter l'événement de Clerk
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data

    // Récupérer l'email principal de l'utilisateur
    const email = email_addresses[0]?.email_address
    const name = `${first_name || ''} ${last_name || ''}`.trim()

    if (!email) {
      return new Response('Erreur : Aucun email fourni', { status: 400 })
    }

    try {
      // Insertion de l'utilisateur dans Neon DB avec Prisma
      await db.user.create({
        data: {
          clerkId: id,
          email: email,
          name: name || null,
        },
      })
      console.log(`[Webhook Clerk] Utilisateur ${id} créé avec succès en BDD.`)
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur en BDD:", error)
      return new Response('Erreur interne de la base de données', { status: 500 })
    }
  }

  return NextResponse.json({ success: true }, { status: 200 })
}