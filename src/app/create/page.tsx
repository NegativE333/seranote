'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Music, Heart, Send } from 'lucide-react';
import { useState } from 'react';

export default function Create() {
  const [song, setSong] = useState('');
  const [showSongSearch, setShowSongSearch] = useState(false);

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <Card className="p-6 shadow-lg border-2 border-primary/10">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-primary">Create Seranote</h2>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary/80">Title of your Seranote</label>
              <Input
                placeholder="Give your note a beautiful title..."
                className="border-primary/20 focus:border-primary/40"
              />
            </div>

            {/* Message Textarea */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary/80">Your Message</label>
              <Textarea
                placeholder="Write your heartfelt message..."
                className="min-h-[150px] border-primary/20 focus:border-primary/40"
              />
            </div>

            {/* Song Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary/80">Choose a Song</label>
              <div className="relative">
                <Input
                  placeholder="Search for a song..."
                  value={song}
                  onChange={(e) => {
                    setSong(e.target.value);
                    setShowSongSearch(true);
                  }}
                  className="border-primary/20 focus:border-primary/40"
                />
                <Music className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />

                {/* Song Search Results */}
                {showSongSearch && song && (
                  <div className="absolute w-full mt-1 bg-white border border-primary/20 rounded-md shadow-lg z-10">
                    <div className="p-2 hover:bg-primary/5 cursor-pointer">
                      <p className="font-medium">Song Title</p>
                      <p className="text-sm text-primary/60">Artist Name</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Receiver Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary/80">
                Receiver's Email (optional)
              </label>
              <Input
                type="email"
                placeholder="Enter receiver's email..."
                className="border-primary/20 focus:border-primary/40"
              />
              <p className="text-sm text-primary/60 italic">
                This will generate a private link if email is left blank.
              </p>
            </div>

            {/* Submit Button */}
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">
              <Send className="w-4 h-4 mr-2" />
              Send Seranote
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
