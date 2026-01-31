<div align="center">

# 🏠 DreamHome

**Nowoczesna platforma ogłoszeniowa dla rynku nieruchomości**

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Laravel](https://img.shields.io/badge/Laravel-10-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[🇬🇧 English](#english) | [🇵🇱 Polski](#polski)

<img src="docs/images/DreamHome-HomePage.png" alt="DreamHome Preview" width="800"/>

</div>

---

## 🇵🇱 Polski

### 📋 Spis treści

- [O projekcie](#-o-projekcie)
- [Funkcjonalności](#-funkcjonalności)
- [Stack technologiczny](#-stack-technologiczny)
- [Architektura](#-architektura)
- [Instalacja](#-instalacja)
- [Struktura projektu](#-struktura-projektu)
- [API Endpoints](#-api-endpoints)
- [Screenshoty](#-screenshoty)
- [Autor](#-autor)

---

### 📖 O projekcie

**DreamHome** to internetowy serwis ogłoszeniowy do wynajmu i sprzedaży nieruchomości. Platforma łączy właścicieli nieruchomości oraz agencje z osobami poszukującymi mieszkań, domów lub lokali użytkowych.

Projekt realizowany w ramach studiów na **Uniwersytecie Morskim w Gdyni** (Wydział Informatyki, kierunek: Informatyka - Aplikacje internetowe i mobilne).

#### Główne cele projektu:

- 🎯 Stworzenie intuicyjnego narzędzia pośredniczącego w obrocie nieruchomościami
- 🏆 Zbudowanie bazy wiarygodnych ogłoszeń z weryfikacją danych
- 💬 System komunikacji w czasie rzeczywistym (wersja Java - WebSocket)
- 📱 Responsywny interfejs (RWD) dostosowany do wszystkich urządzeń

---

### ✨ Funkcjonalności

| Funkcja | Gość | Użytkownik | Agent | Admin |
|---------|:----:|:----------:|:-----:|:-----:|
| Przeglądanie ogłoszeń | ✅ | ✅ | ✅ | ✅ |
| Zaawansowane wyszukiwanie i filtrowanie | ✅ | ✅ | ✅ | ✅ |
| Rejestracja / Logowanie | ✅ | - | - | - |
| Zapisywanie do ulubionych | ❌ | ✅ | ✅ | ❌ |
| Wysyłanie wiadomości (czat) | ❌ | ✅ | ✅ | ❌ |
| Edycja profilu | ❌ | ✅ | ✅ | ✅ |
| Dodawanie ogłoszeń | ❌ | ❌ | ✅ | ✅ |
| Zarządzanie własnymi ogłoszeniami | ❌ | ❌ | ✅ | ✅ |
| Zarządzanie kategoriami/lokalizacjami | ❌ | ❌ | ❌ | ✅ |
| Moderacja użytkowników | ❌ | ❌ | ❌ | ✅ |

#### Kluczowe cechy:

- 🔐 **Uwierzytelnianie JWT** - bezpieczne tokeny dostępu
- 🖼️ **Upload wielu zdjęć** - galeria dla każdego ogłoszenia
- 🔍 **Zaawansowane filtry** - cena, metraż, lokalizacja, typ transakcji
- 📊 **Panel administratora** - zarządzanie słownikami i użytkownikami
- 💾 **System ulubionych** - zapisywanie interesujących ofert
- 🗨️ **Czat w czasie rzeczywistym** (Java) - komunikacja WebSocket

---

### 🛠 Stack technologiczny

#### Backend - Java (Spring Boot)

| Technologia | Wersja | Opis |
|-------------|--------|------|
| Java | 21 LTS | Główny język programowania |
| Spring Boot | 3.5 | Framework aplikacji webowej |
| Spring Security | 6.x | Autoryzacja i uwierzytelnianie |
| Spring Data JPA | - | ORM / dostęp do danych |
| JWT (jjwt) | 0.12 | Tokeny autoryzacyjne |
| PostgreSQL | 15+ | Relacyjna baza danych |
| Lombok | - | Redukcja boilerplate code |
| Gradle | 8.x | Narzędzie budowania |

#### Backend - PHP (Laravel)

| Technologia | Wersja | Opis |
|-------------|--------|------|
| PHP | 8.1+ | Główny język programowania |
| Laravel | 10.x | Framework MVC |
| Firebase JWT | 6.x | Tokeny autoryzacyjne |
| PostgreSQL | 15+ | Relacyjna baza danych |
| Composer | - | Menedżer zależności |

#### Frontend (React)

| Technologia | Wersja | Opis |
|-------------|--------|------|
| React | 19 | Biblioteka UI (SPA) |
| TypeScript | 5.8 | Typowany JavaScript |
| Vite | 6.x | Bundler i dev server |
| TailwindCSS | 4.x | Framework CSS (utility-first) |
| React Router | 7.x | Routing po stronie klienta |
| Zustand | 5.x | Zarządzanie stanem |
| Axios | 1.x | Klient HTTP |
| Lucide React | - | Ikony |

---

### 🏗 Architektura

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + TypeScript)            │
│              SPA + REST API Client + WebSocket              │
└─────────────────────────────────────────────────────────────┘
                              │ HTTP / WS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND (wybór)                         │
├─────────────────────────────┬───────────────────────────────┤
│      Java (Spring Boot)     │       PHP (Laravel)           │
│  ┌───────────────────────┐  │  ┌───────────────────────┐    │
│  │   REST Controllers    │  │  │    API Controllers    │    │
│  │   + WebSocket         │  │  │                       │    │
│  ├───────────────────────┤  │  ├───────────────────────┤    │
│  │   Service Layer       │  │  │      Services         │    │
│  ├───────────────────────┤  │  ├───────────────────────┤    │
│  │   Repository (JPA)    │  │  │   Eloquent Models     │    │
│  └───────────────────────┘  │  └───────────────────────┘    │
└─────────────────────────────┴───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                      │
│  users | listings | listing_images | categories | locations │
│           | favorites | conversations* | messages*          │
└─────────────────────────────────────────────────────────────┘
                                        * tylko wersja Java
```

---

### 🚀 Instalacja

#### Wymagania wstępne

- Node.js 18+ i npm/yarn
- Java 21+ (dla backend-java)
- PHP 8.1+ i Composer (dla backend-php)
- PostgreSQL 15+
- Git

#### 1. Klonowanie repozytorium

```bash
git clone https://github.com/your-username/DreamHome.git
cd DreamHome
```

#### 2. Konfiguracja bazy danych

```sql
CREATE DATABASE dreamhome;
CREATE USER dreamhome_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE dreamhome TO dreamhome_user;
```

#### 3. Backend - Java (Spring Boot)

```bash
cd backend-java

# Konfiguracja (utwórz plik application.properties lub application.yml)
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Edytuj konfigurację bazy danych

# Budowanie i uruchomienie
./gradlew bootRun

# Lub zbuduj WAR
./gradlew bootWar
```

#### 4. Backend - PHP (Laravel)

```bash
cd backend-php

# Instalacja zależności
composer install

# Konfiguracja
cp .env.example .env
php artisan key:generate
# Edytuj .env z danymi bazy danych

# Migracje
php artisan migrate
php artisan db:seed

# Uruchomienie
php artisan serve
```

#### 5. Frontend

```bash
cd frontend

# Instalacja zależności
npm install

# Uruchomienie dev server
npm run dev

# Lub budowanie produkcyjne
npm run build
```

---

### 📁 Struktura projektu

```
DreamHome/
├── backend-java/              # Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/piotrcapecki/dreamhome/
│   │   │   │   ├── config/        # Konfiguracja (Security, JWT, WebSocket)
│   │   │   │   ├── controller/    # REST Controllers
│   │   │   │   ├── dto/           # Data Transfer Objects
│   │   │   │   ├── entity/        # Encje JPA
│   │   │   │   ├── enums/         # Enumy (Role, ListingType, etc.)
│   │   │   │   ├── exception/     # Obsługa wyjątków
│   │   │   │   ├── repository/    # Repozytoria Spring Data
│   │   │   │   └── service/       # Logika biznesowa
│   │   │   └── resources/
│   │   └── test/
│   ├── build.gradle.kts
│   └── gradlew
│
├── backend-php/               # Backend Laravel
│   ├── app/
│   │   ├── Http/Controllers/Api/  # Kontrolery API
│   │   ├── Models/                # Modele Eloquent
│   │   ├── Services/              # Serwisy
│   │   └── Enums/                 # Enumy
│   ├── database/
│   │   ├── migrations/            # Migracje bazy danych
│   │   └── seeders/               # Seedery
│   ├── routes/
│   │   └── api.php                # Definicje tras API
│   └── composer.json
│
├── frontend/                  # Frontend React
│   ├── components/            # Komponenty React
│   │   ├── dashboard/         # Komponenty panelu użytkownika
│   │   ├── layout/            # Layout (Header, Footer, Sidebar)
│   │   ├── listings/          # Komponenty ogłoszeń
│   │   └── ui/                # Komponenty UI (Button, Card, Modal)
│   ├── pages/                 # Strony aplikacji
│   ├── services/              # Serwisy API
│   ├── stores/                # Zustand stores
│   ├── App.tsx
│   ├── types.ts               # Typy TypeScript
│   └── package.json
│
└── docs/                      # Dokumentacja
    ├── documentation.md
    ├── documentation_java.md
    ├── documentation_php.md
    ├── diagrams/              # Diagramy UML (PlantUML)
    ├── images/                # Screenshoty
    └── wireframes/            # Makiety HTML
```

---

### 📡 API Endpoints

#### Autoryzacja
| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | `/api/auth/register` | Rejestracja użytkownika |
| POST | `/api/auth/login` | Logowanie (zwraca JWT) |

#### Ogłoszenia
| Metoda | Endpoint | Opis | Auth |
|--------|----------|------|:----:|
| GET | `/api/listings` | Lista ogłoszeń (z filtrami) | ❌ |
| GET | `/api/listings/:id` | Szczegóły ogłoszenia | ❌ |
| GET | `/api/listings/my` | Moje ogłoszenia | ✅ |
| POST | `/api/listings` | Dodaj ogłoszenie | ✅ |
| PUT | `/api/listings/:id` | Edytuj ogłoszenie | ✅ |
| DELETE | `/api/listings/:id` | Usuń ogłoszenie | ✅ |

#### Ulubione
| Metoda | Endpoint | Opis | Auth |
|--------|----------|------|:----:|
| GET | `/api/favorites` | Lista ulubionych | ✅ |
| POST | `/api/favorites/:listingId` | Dodaj do ulubionych | ✅ |
| DELETE | `/api/favorites/:listingId` | Usuń z ulubionych | ✅ |

#### Słowniki
| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | `/api/categories` | Lista kategorii |
| GET | `/api/locations` | Lista lokalizacji |

#### Użytkownicy
| Metoda | Endpoint | Opis | Auth |
|--------|----------|------|:----:|
| GET | `/api/users/me` | Dane zalogowanego użytkownika | ✅ |
| PUT | `/api/users/me` | Aktualizacja profilu | ✅ |

---

### 📸 Screenshoty

<div align="center">

#### Strona główna
<img src="docs/images/DreamHome-HomePage.png" alt="Strona główna" width="700"/>

#### Lista ogłoszeń
<img src="docs/images/DreamHome-Listings.png" alt="Lista ogłoszeń" width="700"/>

#### Panel użytkownika
<img src="docs/images/DreamHome-UserDashboard.png" alt="Dashboard" width="700"/>

#### Wersja mobilna
<p float="left">
  <img src="docs/images/DreamHome-HomePage-mobile.png" alt="Mobile Home" width="200"/>
  <img src="docs/images/DreamHome-Listings-mobile.png" alt="Mobile Listings" width="200"/>
  <img src="docs/images/DreamHome-UserDashboard-mobile.png" alt="Mobile Dashboard" width="200"/>
</p>

</div>

---

### 👤 Autor

**Piotr Capecki**

- 🎓 Uniwersytet Morski w Gdyni
- 📚 Wydział Informatyki
- 🎯 Kierunek: Informatyka - Aplikacje internetowe i mobilne
- 📅 Semestr 5

---

### 📄 Licencja

Ten projekt został stworzony w celach edukacyjnych w ramach przedmiotu "Programowanie aplikacji webowych" na Uniwersytecie Morskim w Gdyni.

---

## 🇬🇧 English

### About

**DreamHome** is a modern real estate marketplace platform for renting and selling properties. The platform connects property owners and agencies with people looking for apartments, houses, or commercial spaces.

### Key Features

- 🏠 **Property Listings** - Browse, search, and filter real estate offers
- 🔐 **JWT Authentication** - Secure user authentication
- 📱 **Responsive Design** - Works on all devices (mobile-first)
- 💬 **Real-time Chat** (Java version) - WebSocket-based messaging
- ⭐ **Favorites** - Save listings for later
- 🖼️ **Image Gallery** - Multiple photos per listing
- 👨‍💼 **Role-based Access** - Guest, User, Agent, Admin

### Tech Stack

- **Backend (Java):** Spring Boot 3.5, Spring Security, JPA/Hibernate, PostgreSQL
- **Backend (PHP):** Laravel 10, Eloquent ORM, PostgreSQL
- **Frontend:** React 19, TypeScript, TailwindCSS, Vite, Zustand

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/DreamHome.git
cd DreamHome

# Frontend
cd frontend && npm install && npm run dev

# Backend Java
cd backend-java && ./gradlew bootRun

# OR Backend PHP
cd backend-php && composer install && php artisan serve
```

---

<div align="center">

Made with ❤️ at Gdynia Maritime University

</div>
