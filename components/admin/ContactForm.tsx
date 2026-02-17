'use client';

import React from 'react';

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    message: string;
    createdAt: string;
}

interface ContactFormProps {
    messages?: ContactMessage[];
}

export default function ContactForm({ messages = [] }: ContactFormProps) {
    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
                {messages.length === 0 ? (
                    <p className="text-gray-500">No messages yet.</p>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className="border-b pb-4 last:border-b-0">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold">{msg.name}</h3>
                                        <p className="text-sm text-gray-600">{msg.email}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-700">{msg.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}