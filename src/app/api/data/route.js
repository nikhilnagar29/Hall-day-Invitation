import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/app/api/data/messages.json');

async function readMessages() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (err) {
    console.error('Error reading messages:', err);
    return { messages: [] };
  }
}

async function writeMessages(data) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing messages:', err);
    throw new Error('Failed to save messages');
  }
}

export async function GET() {
  const data = await readMessages();
  return Response.json(data);
}

export async function POST(request) {
  try {
    const { name, message } = await request.json();
    
    if (!name || !message) {
      return Response.json(
        { error: 'Name and message are required' },
        { status: 400 }
      );
    }

    const data = await readMessages();
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    data.messages.push({
      _id: Date.now().toString(),
      name,
      message,
      createdAt: formattedDate
    });

    await writeMessages(data);

    return Response.json({ 
      success: true, 
      message: 'Message saved successfully',
      data: data.messages
    });
  } catch (err) {
    console.error('Error in POST request:', err);
    return Response.json(
      { error: 'Failed to save message' },
      { status: 500 }
    );
  }
} 