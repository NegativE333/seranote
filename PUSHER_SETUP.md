# Pusher Setup for Real-time Messaging

This project now uses Pusher for real-time messaging instead of polling every 3 seconds. Here's how to set it up:

## 1. Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Pusher Configuration
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=your_cluster

# Public Pusher Configuration (for client-side)
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
```

## 2. Get Pusher Credentials

1. Go to [pusher.com](https://pusher.com) and create an account
2. Create a new app
3. Go to the "App Keys" tab
4. Copy the credentials to your environment variables

## 3. Database Migration

Run the Prisma migration to add unread message tracking:

```bash
npx prisma migrate dev --name add_unread_message_tracking
```

## 4. Install Dependencies

```bash
npm install
```

## 5. Features Added

- **Real-time messaging**: Messages appear instantly without polling
- **Unread message tracking**: Shows unread count with visual indicators
- **Optimistic updates**: Messages appear immediately when sent
- **Automatic read marking**: Messages are marked as read when viewed
- **Efficient caching**: Uses React Query for smart data management

## 6. How It Works

1. When a user sends a message, it's saved to the database
2. Pusher triggers a `new-message` event to all connected clients
3. Clients receive the message instantly and update their UI
4. Unread counts are calculated and displayed
5. When a user views messages, they're automatically marked as read

## 7. Performance Benefits

- **No more polling**: Eliminates the 3-second interval requests
- **Reduced server load**: Only sends data when there are actual updates
- **Better user experience**: Instant message delivery
- **Lower bandwidth usage**: Only sends new messages, not full message lists
