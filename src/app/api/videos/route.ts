import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, orderBy, limit, startAfter, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limitParam = parseInt(searchParams.get('limit') || '10');
  const subject = searchParams.get('subject');
  
  try {
    let videosQuery = query(
      collection(db, 'videos'),
      orderBy('createdAt', 'desc'),
      limit(limitParam)
    );
    
    if (subject) {
      videosQuery = query(
        collection(db, 'videos'),
        where('subject', '==', subject),
        orderBy('createdAt', 'desc'),
        limit(limitParam)
      );
    }
    
    // If pagination is requested
    if (page > 1) {
      // Get the last visible document from the previous page
      const lastVisibleDoc = await getLastVisibleDoc(page, limitParam, subject);
      
      if (lastVisibleDoc) {
        videosQuery = query(
          collection(db, 'videos'),
          subject ? where('subject', '==', subject) : null,
          orderBy('createdAt', 'desc'),
          startAfter(lastVisibleDoc),
          limit(limitParam)
        );
      }
    }
    
    const querySnapshot = await getDocs(videosQuery);
    
    const videos = [];
    querySnapshot.forEach((doc) => {
      videos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return NextResponse.json({
      success: true,
      count: videos.length,
      videos
    });
  } catch (error) {
    console.error('Error getting videos:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch videos' 
    }, { status: 500 });
  }
}

// Helper function to get the last visible document for pagination
async function getLastVisibleDoc(page: number, limitParam: number, subject: string | null): Promise<QueryDocumentSnapshot<DocumentData> | null> {
  const previousPageQuery = query(
    collection(db, 'videos'),
    subject ? where('subject', '==', subject) : null,
    orderBy('createdAt', 'desc'),
    limit((page - 1) * limitParam)
  );
  
  const querySnapshot = await getDocs(previousPageQuery);
  const docs: QueryDocumentSnapshot<DocumentData>[] = [];
  
  querySnapshot.forEach((doc) => {
    docs.push(doc);
  });
  
  return docs.length > 0 ? docs[docs.length - 1] : null;
} 