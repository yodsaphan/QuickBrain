'use client';

import { useState, useEffect } from 'react';
import { getDocuments, addDocument, updateDocument, deleteDocument, uploadFile } from '@/services/firebase';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

export default function FirebaseTest() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [newDocument, setNewDocument] = useState({ title: '', content: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Load documents on component mount
  useEffect(() => {
    loadDocuments();
    // Set up auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await getDocuments('test');
      setDocuments(docs);
      setError(null);
    } catch (error) {
      console.error('Error loading documents:', error);
      setError('Failed to load documents. Please check your Firebase configuration.');
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDocument('test', {
        ...newDocument,
        createdAt: new Date().toISOString(),
      });
      setNewDocument({ title: '', content: '' });
      await loadDocuments();
      setError(null);
    } catch (error) {
      console.error('Error adding document:', error);
      setError('Failed to add document. Please check your Firebase configuration.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      try {
        const downloadURL = await uploadFile(file, `uploads/${file.name}`);
        console.log('File uploaded successfully:', downloadURL);
        setError(null);
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Failed to upload file. Please check your Firebase configuration.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setError(null);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Failed to sign in. Please check your Firebase configuration.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setError(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Firebase Test Component</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Authentication Section */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Authentication</h2>
        {user ? (
          <div>
            <p>Logged in as: {user.email}</p>
            <button
              onClick={handleSignOut}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={handleGoogleSignIn}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign in with Google
          </button>
        )}
      </div>

      {/* Document Form */}
      <form onSubmit={handleAddDocument} className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Add New Document</h2>
        <div className="mb-4">
          <label className="block mb-2">Title:</label>
          <input
            type="text"
            value={newDocument.title}
            onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Content:</label>
          <textarea
            value={newDocument.content}
            onChange={(e) => setNewDocument({ ...newDocument, content: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Document
        </button>
      </form>

      {/* File Upload Section */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">File Upload</h2>
        <input
          type="file"
          onChange={handleFileUpload}
          className="mb-2"
        />
        {selectedFile && (
          <p>Selected file: {selectedFile.name}</p>
        )}
      </div>

      {/* Documents List */}
      <div className="p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Documents</h2>
        {documents.length === 0 ? (
          <p>No documents found</p>
        ) : (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li key={doc.id} className="p-2 border rounded">
                <h3 className="font-semibold">{doc.title}</h3>
                <p>{doc.content}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(doc.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}