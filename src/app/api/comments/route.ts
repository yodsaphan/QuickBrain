import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');
  
  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }
  
  try {
    // Query comments for this video, ordered by creation time
    const q = query(
      collection(db, 'comments'),
      where('videoId', '==', videoId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const comments = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      comments.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date()
      });
    });
    
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error getting comments:', error);
    return NextResponse.json({ error: 'Failed to get comments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'You must be logged in to comment' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { videoId, text } = body;
    
    if (!videoId || !text) {
      return NextResponse.json({ error: 'Video ID and text are required' }, { status: 400 });
    }
    
    // Create comment document
    const commentData = {
      videoId,
      userId: session.user.id,
      username: session.user.username,
      userProfilePic: session.user.image || '',
      text,
      likes: 0,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'comments'), commentData);
    
    // Update comment count on video
    const videoRef = doc(db, 'videos', videoId);
    await updateDoc(videoRef, {
      comments: increment(1)
    });
    
    return NextResponse.json({
      success: true,
      comment: {
        id: docRef.id,
        ...commentData,
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
} 