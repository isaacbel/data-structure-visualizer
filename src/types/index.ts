export type Language = 'en' | 'fr'
export type Theme = 'dark' | 'light'
export type HighlightColor = boolean | 'yellow' | 'green' | 'red' | 'blue' | string

export interface VisualNode {
  id: string
  value: string | number
  x: number
  y: number
  highlight?: HighlightColor
  opacity?: number
  index?: number
  next?: string | null
  prev?: string | null
  left?: string | null
  right?: string | null
  parent?: string | null
  priority?: number
  height?: number
  balanceFactor?: number
  color?: 'red' | 'black' | string
}

export interface VisualEdge {
  from: string
  to: string
  weight?: number
  directed?: boolean
  highlight?: boolean
  type?: 'back' | 'loop'
}

export interface VisualPointer {
  name: string
  targetId: string
}

export interface HashBucket {
  index: number
  items: Array<{ value: string; highlight?: HighlightColor }>
  highlight?: boolean
}

export interface VisualState {
  nodes?: VisualNode[]
  edges?: VisualEdge[]
  pointers?: VisualPointer[]
  buckets?: HashBucket[]
  head?: string
  tail?: string
  rootId?: string
  visited?: Array<string | number>
  description?: string
  highlightedCodeLine?: number
  stepNumber?: number
  totalSteps?: number
  comparisons?: number
  swaps?: number
  memoryUsage?: number
  queue?: string[]
  stack?: string[]
  priorityQueue?: Array<{ value: string; priority: number }>
  distanceTable?: Record<string, string | number>
  parentTable?: Record<string, string>
}

export type StructureType = 'linear' | 'linked' | 'stack' | 'queue' | 'tree' | 'graph' | 'hash'

export interface DataStructureConfig {
  id: string
  type: StructureType
  category: CategoryId
  ops: string[]
  name: Record<Language, string>
  description: Record<Language, string>
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  implemented: boolean
  learningPath?: LearningPathId
}

export type CategoryId = 'linear' | 'tree' | 'graph' | 'hash' | 'advanced' | 'sorting' | 'string' | 'dp'
export type LearningPathId = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export interface AnimationStep {
  description: string
  codeLine: number
  modifier: (state: VisualState) => VisualState
}

export type CodeLanguage =
  | 'python'
  | 'c'
  | 'cpp'
  | 'java'
  | 'javascript'
  | 'typescript'
  | 'rust'
  | 'go'
  | 'csharp'
  | 'kotlin'
  | 'swift'
  | 'php'


export interface ComplexityInfo {
  access: string
  search: string
  insert: string
  delete: string
  space: string
}

export interface CategorizedResource {
  title: string
  author: string
  pubYear?: string
  href: string
  category: 'book' | 'paper' | 'lecture' | 'video' | 'practice' | 'repo' | 'db_docs' | 'article'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  whyRecommended: string
  estimatedReadTime: string
}

export interface RealWorldUse {
  system: string       // e.g. "PostgreSQL", "Linux Scheduler", "CPython dict"
  domain: string       // e.g. "Database Indexing", "OS Process Management"
  explanation: string  // Details on how the DS is applied in production
}

export interface ComparisonPair {
  targetId: string
  title: string
  keyDifferences: string[]
  performanceComparison: Record<string, { a: string; b: string }>
  whenToUseWhich: { useA: string; useB: string }
}

export interface TheoryResource {
  label: string
  href: string
  type: 'book' | 'video' | 'article' | 'practice' | 'paper' | 'repo'
}

export interface AcademicChangelog {
  version: string
  date: string
  changes: string
}

export interface TheoryContent {
  definition: string
  complexity: ComplexityInfo
  applications: string
  advantages: string
  disadvantages: string
  // Optional extended fields used in TheoryTab advanced cards
  history?: string
  intuition?: string
  mathematicalFoundation?: string
  comparisons?: string
  commonMistakes?: string[]
  interviewQuestions?: string[]
  optimizations?: string[]
  references?: string[]
  // Richer educational fields
  relatedTopics?: string[]        // DS/algo IDs to link to (e.g. 'bst', 'avl')
  resources?: TheoryResource[]    // Legacy format resources
  categorizedResources?: CategorizedResource[] // New metadata-rich resources
  pseudocode?: string             // Human-readable algorithmic pseudocode
  stepByStep?: string[]           // Numbered walkthrough steps for key operation
  // Advanced Chapter Fields (Parts 5, 8, 9, 10, 11, 12)
  realWorldUses?: RealWorldUse[]
  designRationale?: string
  misconceptions?: string[]
  variants?: string[]
  debuggingAdvice?: string[]
  frequentBugs?: string[]
  relatedResearch?: string[]
  glossary?: Array<{ term: string; definition: string }>
  faq?: Array<{ question: string; answer: string }>
  summary?: string
  prerequisites?: string[]
  learningObjectives?: string[]
  estimatedStudyTime?: string
  suggestedExercises?: string[]
  comparisonData?: ComparisonPair[]
  // Versioned Educational Content (Phase 16)
  version?: string
  lastUpdated?: string
  changelog?: AcademicChangelog[]
  contributors?: string[]
  referencesReviewedDate?: string
}

export * from './quiz'

export type AnimationStatus = 'idle' | 'playing' | 'paused' | 'finished'

export interface AnimationStats {
  comparisons: number
  swaps: number
  operations: number
  memoryUsage: number
}
