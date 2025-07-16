# Splitwise Clone

A simple, neo-brutalist expense splitting app built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 📱 Phone number-based login (no authentication for now)
- 👥 Create groups with multiple members
- 💰 Add and split expenses within groups
- 📊 Automatic balance calculations
- 🎨 Neo-brutalist design with animations
- 📱 Mobile-responsive interface
- 💚 WhatsApp green themed UI

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom neo-brutalist design system
- **State**: In-memory store (ready for database integration)
- **Fonts**: Inter + Space Grotesk

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/splitwise-clone.git
cd splitwise-clone
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Login**: Enter your name and phone number to get started
2. **Create Group**: Click "Create New Group" and add members by phone number
3. **Add Expenses**: Select a group, click "Add Expense", and specify who paid and how to split
4. **View Balances**: See who owes whom within each group

## Design System

- Background: `#FAF9F6` (warm off-white)
- Primary: `#25D366` (WhatsApp green)
- Accent: `#FF7A00` (orange)
- All elements have 4px black borders and 20px border radius
- Interactive elements have hover and active states with shadow effects

## Future Enhancements

- [ ] Proper authentication with OTP
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Settle up functionality
- [ ] Expense categories
- [ ] Receipt photo uploads
- [ ] Export expense reports
- [ ] Push notifications

## Contributing

Feel free to submit issues and pull requests!

## License

MIT