# Analytics Module

This module provides comprehensive analytics functionality for the evaluation system, fetching data from the SQLite database and presenting it through various visualizations.

## Structure

```
src/database/analytics/
├── index.ts          # Main exports
├── types.ts          # TypeScript interfaces
├── queries.ts        # Database queries
└── README.md         # This file
```

## Database Schema

The analytics module works with the following database schema:

```sql
CREATE TABLE IF NOT EXISTS question (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS evaluation (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL,
  answer TEXT NOT NULL,
  score INTEGER NOT NULL,
  justification TEXT,
  llm_model TEXT NOT NULL,
  timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE
);
```

## Features

### Analytics Summary
- **Total Answers Evaluated**: Count of all evaluations in the system
- **Overall Average Score**: Average score across all evaluations
- **Average Score per Question**: Breakdown of scores by individual questions
- **Evaluations Over Time**: Time-series data showing evaluation trends

### Visualizations
- **Line/Area Charts**: Interactive charts showing evaluations over time
- **Summary Cards**: Key metrics displayed in card format
- **Data Tables**: Detailed tables for questions and evaluations

### Extensibility
The module is designed to be easily extensible:
- Modular query functions for different data needs
- Reusable components for different chart types
- Type-safe interfaces for all data structures
- Custom hooks for data management

## Usage

### Basic Usage
```typescript
import { useAnalytics } from '@/hooks/useAnalytics';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

function MyComponent() {
  const { analyticsData, loading, error, refreshData } = useAnalytics();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <AnalyticsDashboard />;
}
```

### Custom Queries
```typescript
import { getEvaluationsByDateRange, getEvaluationsByQuestion } from '@/database/analytics/queries';

// Get evaluations for a specific date range
const evaluations = await getEvaluationsByDateRange('2024-01-01', '2024-01-31');

// Get evaluations for a specific question
const questionEvaluations = await getEvaluationsByQuestion(1);
```

## Components

### AnalyticsDashboard
Main dashboard component that combines all analytics features.

### AnalyticsCard
Reusable card component for displaying key metrics.

### ScoreChart
Chart component using Recharts for time-series visualization.

### QuestionScoresTable
Table component displaying average scores per question.

### EvaluationsTable
Table component showing detailed evaluation data.

## Future Enhancements

The module is designed to support future additions such as:
- Filtering by date ranges
- Export functionality
- More chart types (bar charts, pie charts)
- Performance metrics
- User-specific analytics
- Comparative analysis between different time periods
