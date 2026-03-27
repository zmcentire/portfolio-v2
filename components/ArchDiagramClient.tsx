'use client'

// ArchDiagramClient — thin client boundary for the [slug] Server Component.
//
// The problem: [slug]/page.tsx is a Server Component. ARCH_DIAGRAMS is a
// Record<string, React.FC> — a map of function references. Next.js 14 RSC
// cannot serialize function references across the server→client boundary
// and fails at build time with "Could not find the module in the React
// Client Manifest."
//
// The fix: the Server Component passes only a serializable string (projectId).
// This Client Component does the ARCH_DIAGRAMS lookup entirely on the client
// side, where function references are fine.

import { ARCH_DIAGRAMS } from '@/components/ArchDiagram'

interface Props {
  projectId: string
}

export default function ArchDiagramClient({ projectId }: Props) {
  const Diagram = ARCH_DIAGRAMS[projectId]
  if (!Diagram) return null
  return <Diagram />
}