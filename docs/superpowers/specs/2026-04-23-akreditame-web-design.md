# Design Spec: Akredita Me Institutional Website

## Project Overview
Akredita Me is a platform for structuring real assets and connecting them with private capital. This project involves building the institutional landing page to showcase its multi-vertical model (Energy, Infrastructure, Real Estate) and capture high-quality leads.

## Objectives
- **Aesthetic Excellence**: "WOW" the user with a dynamic, visionary, and premium design.
- **Clear Communication**: Explain the "Financial Infrastructure Layer" concept clearly.
- **Modular Scalability**: Easily add new vertical divisions in the future.
- **Lead Capture**: Securely capture and store project and investor leads.

## Visual Style: "Visionary Dynamic"
- **Color Palette**: Deep financial blues, vibrant "energy" greens, and metallic silver accents.
- **Elements**: Glassmorphism (frosted glass effects), moving gradients, and subtle micro-animations for transitions.
- **Imagery**: High-quality representations of real assets combined with abstract data/flow visualizations.

## Architecture & Technology Stack
- **Frontend**: Vite + React + Vanilla CSS.
- **Backend API**: Node.js/Express (Containerized in Coolify).
- **Database**: PostgreSQL (Containerized in Coolify).
- **Deployment**: VPS via Coolify.
- **Email**: Resend or SMTP (for lead notifications).

## Page Structure
1. **Hero**: High-impact animation with the core tagline "Estructurando activos. Conectando capital."
2. **The "What is Akredita Me" Section**: Concise explanation of the platform as an infrastructure layer.
3. **Verticals Hub**: A modular grid showing current (Energy) and future (Infra, Real Estate) divisions.
4. **The "Stucturing Flow"**: An animated timeline visualization: Capital → Structuring → Vehicle → Active Asset → Distribution.
5. **Lead Capture Wizard**: A multi-step form identifying if the user is an Investor or Project Developer.

## Data Model (PostgreSQL)
### Table: `leads`
- `id` (UUID, PK)
- `full_name` (String)
- `company` (String)
- `email` (String)
- `phone` (String)
- `interest_type` (Enum: Investor, Developer, Partner)
- `vertical` (Enum: Energy, Infra, Real Estate, General)
- `message` (Text)
- `created_at` (Timestamp)
- `status` (String: New, Contacted, Rejected)

## Success Criteria
- Page loads in under 1.5s.
- Mobile-responsive with flawless animations on touch.
- Forms successfully save to DB and trigger email notifications.
