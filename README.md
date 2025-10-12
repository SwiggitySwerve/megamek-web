# BattleTech Editor App

A Next.js application for editing and managing BattleTech units and equipment data.

## Features

- **Unit Customization**: Advanced BattleTech unit customization with critical slot management
- **Equipment Management**: Comprehensive equipment browser and allocation system
- **Multi-Unit Support**: Manage multiple unit configurations simultaneously
- **Real-time Validation**: Live validation of unit configurations and equipment placement
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Open your browser to `http://localhost:3000`

## Architecture

The application uses a modern React-based architecture with:

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API with custom hooks
- **Data**: JSON-based mock data for development and testing

## API Endpoints

The application provides REST API endpoints for accessing data:

- `GET /api/units` - List units with filtering and pagination
- `GET /api/equipment` - List equipment with filtering and pagination
- `GET /api/custom-variants` - List custom unit variants
- `GET /api/custom-variants/[id]` - Get specific variant details
- `GET /api/meta/categories` - Get unit categories
- `GET /api/meta/unit_eras` - Get unit eras
- `GET /api/meta/unit_tech_bases` - Get unit tech bases
- `GET /api/meta/equipment_categories` - Get equipment categories
- `GET /api/meta/equipment_eras` - Get equipment eras
- `GET /api/meta/equipment_tech_bases` - Get equipment tech bases

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Project Structure

```
├── components/          # React components
│   ├── common/         # Shared components
│   ├── criticalSlots/  # Critical slot management
│   ├── editor/         # Unit editing components
│   ├── equipment/      # Equipment management
│   ├── multiUnit/      # Multi-unit support
│   └── overview/       # Unit overview
├── pages/              # Next.js pages and API routes
├── services/           # Business logic services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── public/mockdata/    # Mock data for development
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.