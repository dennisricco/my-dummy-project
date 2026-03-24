'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Message } from '../../types';
import { formatTime } from '../../utils/formatTime';
import { useChatStore } from '../../store/useChatStore';

interface MessageBubbleProps {
  message: Message;
  isConsecutive?: boolean;
}

export default function MessageBubble({ message, isConsecutive }: MessageBubbleProps) {
  const isUser = message.isUser;
  const isBot = message.isBot;

  const bubbleRef = useRef<HTMLDivElement>(null);

  const [displayedText, setDisplayedText] = useState(isBot ? '' : message.content);
  const [isTypingText, setIsTypingText] = useState(isBot);

  useEffect(() => {
    if (!isBot) return;
    let i = 0;
    const fullText = message.content;
    if (displayedText.length < fullText.length) {
      const interval = setInterval(() => {
        setDisplayedText(fullText.slice(0, i + 1));
        i++;
        if (i >= fullText.length) {
          clearInterval(interval);
          setIsTypingText(false);
        }
      }, 22);
      return () => clearInterval(interval);
    } else {
      setIsTypingText(false);
    }
  }, [message.content, isBot]);

  useEffect(() => {
    if (!bubbleRef.current) return;
    gsap.set(bubbleRef.current, {
      opacity: 0,
      scale: 0.85,
      x: isUser ? 30 : -30,
      transformPerspective: 800,
    });
    gsap.to(bubbleRef.current, {
      opacity: 1,
      scale: 1,
      x: 0,
      duration: 0.45,
      ease: 'back.out(1.4)',
      delay: isConsecutive ? 0.03 : 0,
    });
  }, [isUser, isConsecutive]);

  return (
    <div
      ref={bubbleRef}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      style={{
        paddingLeft: '28px',
        paddingRight: '28px',
        marginTop: isConsecutive ? '4px' : '20px',
        willChange: 'transform, opacity',
      }}
    >
      <div
        style={{
          maxWidth: '68%',
          minWidth: '80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isUser ? 'flex-end' : 'flex-start',
        }}
      >
        <div
          className="relative"
          style={{
            padding: '10px 14px',
            backgroundColor: isUser
              ? 'var(--bg-message-out)'
              : 'var(--bg-message-in)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: isUser
              ? '0 2px 12px rgba(14,165,233,0.12)'
              : '0 2px 12px rgba(0,0,0,0.25)',
            border: isUser
              ? '1px solid rgba(14,165,233,0.2)'
              : '1px solid rgba(255,255,255,0.06)',
            borderRadius: isUser
              ? '18px 18px 4px 18px'
              : '18px 18px 18px 4px',
          }}
        >
          {/* Bot subtle top glow line */}
          {!isUser && (
            <div
              className="absolute top-0 left-4 right-4 h-px pointer-events-none"
              style={{
                background: 'linear-gradient(to right, transparent, rgba(14,165,233,0.25), transparent)',
                borderRadius: '1px',
              }}
            />
          )}

          <p
            className={`text-sm leading-relaxed wrap-break-word whitespace-pre-wrap ${
              isBot && isTypingText ? 'typewriter-text' : isBot ? 'typewriter-text done' : ''
            }`}
            style={{ color: 'var(--text-primary)' }}
          >
            {isBot ? displayedText : message.content}
          </p>

          {/* Timestamp + read tick */}
          <div
            className={`flex items-center gap-1 mt-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <span
              style={{
                fontSize: '10px',
                fontWeight: 500,
                color: 'var(--text-muted)',
                letterSpacing: '0.02em',
              }}
            >
              {formatTime(message.timestamp)}
            </span>
            {isUser && (
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 15"
                fill="var(--accent-primary)"
                style={{ opacity: 0.8 }}
              >
                <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
