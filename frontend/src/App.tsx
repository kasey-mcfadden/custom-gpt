import { Box, Button, CircularProgress, Container, Paper, TextField, Typography } from '@mui/material';
import 'highlight.js/styles/default.css';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import './App.css';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const firstMessage: Message = { 
  role: 'system', 
  content: 'You are a helpful assistant.' 
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([firstMessage]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    setInput('');
    const newMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await response.json();

      const botMessage: Message = { role: 'assistant', content: data.response };
      setMessages([...updatedMessages, botMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Chat
      </Typography>

      <Paper sx={{ p: 2, mb: 2, height: '80vh', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{ mb: 2, mt: 0 }}>
            {msg.role === 'user' && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '75%',
                    backgroundColor: '#e5e5ea',
                    borderRadius: '10px',
                    p: 1,
                    wordBreak: 'break-word',
                    overflowX: 'scroll'
                  }}
                >
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {msg.content}
                  </ReactMarkdown>
                </Box>
              </Box>
            )}
            {msg.role === 'assistant' && (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {msg.content}
              </ReactMarkdown>
            )}
          </Box>
        ))}
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}

        <div ref={chatEndRef} />
      </Paper>

      <Box sx={{ display: 'flex' }}>
        <TextField
          sx={{ whiteSpace: 'pre-wrap' }}
          multiline
          maxRows={6}
          fullWidth
          label="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          sx={{ ml: 1 }}
        >
          Send
        </Button>
      </Box>
    </Container>
  );
};

export default App;
