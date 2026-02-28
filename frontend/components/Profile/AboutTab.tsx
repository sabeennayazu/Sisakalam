"use client";

import { MapPin, Link2, Calendar, Mail, Twitter, Instagram } from "lucide-react";

export default function AboutTab() {
    return (
        <div className="max-w-2xl mx-auto py-4">
            <h2 className="font-serif font-bold text-2xl text-black mb-6">Julian Valerius</h2>

            <div className="prose prose-sm text-gray-600 font-serif leading-loose mb-10">
                <p className="mb-4 text-base">
                    Julian Valerius is a poet and fiction writer based in Paris, France. His work primarily explores the intersection of memory, modern isolation, and the ephemeral beauty of the mundane.
                </p>
                <p className="mb-4 text-base">
                    Drawing inspiration from 20th-century noir and classical romanticism, Julian's writing seeks to capture the quiet moments that often go unnoticed in the rush of contemporary life. He has been published in several independent literary journals across Europe.
                </p>
                <p className="text-base italic pl-4 border-l-2 border-black">
                    "I write not to be understood, but to understand what escapes me when I am not holding a pen."
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-200">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Details</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-sm text-gray-600">
                            <MapPin size={16} className="text-black" />
                            <span>Paris, France</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-600">
                            <Link2 size={16} className="text-black" />
                            <a href="#" className="hover:text-black hover:underline underline-offset-4 transition-all">julianvalerius.com</a>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-600">
                            <Calendar size={16} className="text-black" />
                            <span>Joined January 2024</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Connect</h3>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors">
                            <Mail size={16} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors">
                            <Twitter size={16} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors">
                            <Instagram size={16} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
