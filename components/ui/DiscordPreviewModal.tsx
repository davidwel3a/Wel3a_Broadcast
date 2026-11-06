'use client';

import React from 'react';
import { X, Bot } from 'lucide-react';
import { MessagePayload, BotInfo } from '../../types';

interface DiscordPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: MessagePayload;
  botInfo?: BotInfo | null;
  title: string;
}

export const DiscordPreviewModal: React.FC<DiscordPreviewModalProps> = ({
  isOpen,
  onClose,
  message,
  botInfo,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-[#313338] text-[#dbdee1] rounded-xl shadow-2xl border border-white/10 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#2b2d31] border-b border-white/5">
          <span className="text-xs font-semibold text-[#949ba4] uppercase tracking-wider">
            {title}
          </span>
          <button
            onClick={onClose}
            className="text-[#b5bac1] hover:text-white transition-colors p-1 rounded-md"
            aria-label="Close preview"
          >
            <X size={18} />
          </button>
        </div>

        {/* Discord Message Bubble */}
        <div className="p-5 flex gap-4">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center flex-shrink-0 text-white font-bold overflow-hidden shadow-sm">
            {botInfo?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={botInfo.avatar} alt="Bot Avatar" className="w-full h-full object-cover" />
            ) : (
              <Bot size={22} />
            )}
          </div>

          {/* Content Body */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header info */}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-white text-sm hover:underline cursor-pointer">
                {botInfo?.username || 'Broadcast Bot'}
              </span>
              <span className="bg-[#5865f2] text-white text-[10px] font-bold px-1.5 py-0.5 rounded leading-none">
                BOT
              </span>
              <span className="text-xs text-[#949ba4]">Today at 12:00 PM</span>
            </div>

            {/* Plain text message */}
            {message.content && (
              <div className="text-sm whitespace-pre-wrap leading-relaxed text-[#dbdee1] mb-2 break-words">
                {message.content}
              </div>
            )}

            {/* Rich Embed */}
            {message.embed && (
              <div
                className="mt-1 bg-[#2b2d31] rounded-lg p-3.5 border-l-4 max-w-lg shadow-sm"
                style={{ borderLeftColor: message.embed.color || '#5865f2' }}
              >
                {message.embed.title && (
                  <h4 className="font-bold text-white text-sm mb-1.5 break-words">
                    {message.embed.title}
                  </h4>
                )}
                {message.embed.description && (
                  <p className="text-xs text-[#dbdee1] whitespace-pre-wrap leading-relaxed break-words mb-2">
                    {message.embed.description}
                  </p>
                )}
                {message.embed.image && (
                  <div className="mt-2 rounded-md overflow-hidden max-h-60 bg-black/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={message.embed.image}
                      alt="Embed graphic"
                      className="w-full object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Attached Image */}
            {message.imageUrl && (
              <div className="mt-2.5 rounded-lg overflow-hidden max-w-md bg-black/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={message.imageUrl}
                  alt="Attachment"
                  className="w-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
