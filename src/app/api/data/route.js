import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/app/api/data/messages.json');

async function readMessages() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    return { messages: [] };
  }
}

async function writeMessages(data) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
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
    data.messages.push({
      name,
      message,
      timestamp: new Date().toISOString()
    });

    await writeMessages(data);

    return Response.json({ 
      success: true, 
      message: 'Message saved successfully',
      data: data.messages
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to save message' },
      { status: 500 }
    );
  }
} 