import { Metadata } from 'next';
import ChessGame from '@/components/chess/ChessGame';

export const metadata: Metadata = {
  title: 'Chess Game | Sam Swerczek',
  description: 'Play chess against an AI opponent. Interactive chess game built with Next.js and React.',
  openGraph: {
    title: 'Chess Game | Sam Swerczek',
    description: 'Play chess against an AI opponent.',
    type: 'website',
  },
};

export default function ChessPage() {
  return <ChessGame />;
}
