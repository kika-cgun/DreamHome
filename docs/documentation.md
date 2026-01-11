<div align="center">

# DOKUMENTACJA PROJEKTU SERWISU WWW

**Uczelnia:** Uniwersytet Morski w Gdyni  
**Wydział:** Elektryczny  
**Przedmiot:** Programowanie aplikacji webowych (Projekt) / Projektowanie serwisów internetowych (Projekt)  
**Semestr:** 5

</div>


---

### Autor:
**Piotr Capecki**

---

### 1. Nazwa i temat serwisu/aplikacji
**Nazwa:** DreamHome  
**Temat:** Internetowy serwis ogłoszeniowy do wynajmu i sprzedaży nieruchomości.  
Projekt zakłada stworzenie platformy łączącej właścicieli nieruchomości oraz agencje z osobami poszukującymi mieszkań, domów lub lokali użytkowych.

---

### 2. Cel istnienia serwisu z punktu widzenia właściciela
Głównym celem biznesowym aplikacji jest:
* Stworzenie intuicyjnego narzędzia pośredniczącego w obrocie nieruchomościami.
* Zbudowanie bazy wiarygodnych ogłoszeń, co pozwoli na przyszłą monetyzację serwisu (np. poprzez wyróżnianie ofert lub konta premium dla agencji).
* Dostarczenie użytkownikom platformy o wysokim standardzie User Experience (UX), zachęcającej do powrotu.

---

### 3. Ogólny opis przeznaczenia i działania
Serwis funkcjonuje jako *marketplace*. Umożliwia przeglądanie bazy ofert (read-only dla niezalogowanych) oraz aktywne zarządzanie treścią (dla zalogowanych).

**Role użytkowników:**
* **Gość (Niezalogowany):** Przeglądanie strony głównej, korzystanie z wyszukiwarki i filtrów, podgląd szczegółów ogłoszenia.
* **Użytkownik Zalogowany (Poszukujący):** Funkcje Gościa + możliwość dodawania ogłoszeń do "Ulubionych", edycja własnego profilu.
* **Ogłoszeniodawca (Agent/Właściciel):** Funkcje Użytkownika + dodawanie nowych ogłoszeń, edycja i usuwanie własnych ofert, zarządzanie statusem oferty (np. "Rezerwacja").
* **Administrator:** Pełen dostęp do systemu (CRUD na wszystkich tabelach), zarządzanie kategoriami i lokalizacjami, moderacja użytkowników.

---

### 4. Główna grupa docelowa
1.  **Poszukujący:** Osoby w wieku 19-50 lat (studenci, single, rodziny), szukające lokum. Cechuje ich potrzeba szybkiego filtrowania ofert (cena/lokalizacja) oraz przejrzystości danych.
2.  **Oferujący:** Właściciele prywatni oraz małe agencje nieruchomości, szukające alternatywy dla drogich portali ogłoszeniowych.

---

### 5. Przegląd rozwiązań konkurencyjnych
**Konkurencja:**
* **Otodom.pl:** Lider rynku, bardzo rozbudowany, ale drogi w użytkowaniu dla wystawiających.
* **OLX Nieruchomości:** Popularny, lecz posiada niski próg wejścia, co skutkuje dużą liczbą ogłoszeń niskiej jakości lub nieaktualnych (spam).

**Przewaga konkurencyjna projektu DreamHome:**
* **Minimalistyczny UX:** Skupienie na treści, brak rozpraszających reklam banerowych.
* **Weryfikacja:** System wymuszający podanie kluczowych parametrów (metraż, piętro, rok budowy) – brak "pustych" ogłoszeń.
* **Szybkość działania:** Lekki interfejs zoptymalizowany pod urządzenia mobilne.

---

### 6. Wymagania funkcjonalne i niefunkcjonalne

**Wymagania funkcjonalne (zakres diagramów przypadków użycia):**
1.  Rejestracja i logowanie (uwierzytelnianie).
2.  Wyszukiwanie ogłoszeń z wykorzystaniem filtrów (Cena od-do, Powierzchnia, Kategoria).
3.  Przeglądanie listy wyników oraz strony szczegółów ogłoszenia.
4.  Dodawanie, edycja i usuwanie ogłoszeń (tylko dla właściciela ogłoszenia).
5.  Dodawanie ogłoszeń do schowka "Ulubione".
6.  Panel Administratora: zarządzanie słownikami (Kategorie, Miasta).

**Wymagania niefunkcjonalne:**
1.  **Bezpieczeństwo:** Walidacja danych wejściowych (ochrona przed XSS/SQL Injection), bezpieczne haszowanie haseł.
2.  **Responsywność (RWD):** Interfejs dostosowujący się do ekranów smartfonów, tabletów i desktopów.
3.  **Obsługa błędów:** Czytelne komunikaty dla użytkownika w przypadku pomyłek (walidacja formularzy) lub błędów serwera (strony 404/500).

---

### 7. Schemat nawigacji
Struktura menu i przepływ sterowania:

1.  **Menu Główne:** [Logo/Home], [Szukaj], [O nas].
    * *Jeśli niezalogowany:* [Zaloguj], [Zarejestruj].
    * *Jeśli zalogowany:* [Moje Konto], [Ulubione], [Wyloguj].
    * *Jeśli Agent/Admin:* [Dodaj Ogłoszenie], [Panel Administracyjny].
2.  **Ścieżka Użytkownika:** Home -> Lista Wyników -> Szczegóły Ogłoszenia -> Kontakt.
3.  **Ścieżka Agenta:** Panel Użytkownika -> Moje Ogłoszenia -> Formularz Dodawania -> Podgląd/Zatwierdzenie.

---

### 8. Model bazy danych (Opis)
Baza danych składa się z powiązanych tabel (Diagram Klas UML):

1.  **`users`**: Przechowuje dane o kontach (PK: id, login, password, role, contact_info).
2.  **`categories`**: Słownik typów nieruchomości (PK: id, name [np. Mieszkanie, Dom]).
3.  **`locations`**: Słownik miejscowości (PK: id, city_name, district).
4.  **`listings`**: Główna tabela z ofertami (PK: id, title, price, area, description, image_url, FK: user_id, FK: category_id, FK: location_id).
5.  **`favorites`**: Tabela łącząca relacją wiele-do-wielu użytkowników i oferty (FK: user_id, FK: listing_id).

**Relacje:**
* `users` 1 : N `listings` (Jeden użytkownik może mieć wiele ofert).
* `categories` 1 : N `listings` (Jedna kategoria przypisana do wielu ofert).
* `users` N : M `listings` (przez tabelę `favorites`).

---

### 9. Schematy graficzne i układ treści
Dla projektu przygotowano interaktywne makiety (wireframes) w technologii HTML/CSS, odwzorowujące układ elementów dla kluczowych widoków. Stylistyka makiet jest minimalistyczna ("lo-fi"), skupiająca się na rozmieszczeniu treści i funkcjonalności (RWD).

#### 9.1. Widok Strony Głównej (Home)
Strona startowa zawiera nagłówek z nawigacją, sekcję Hero z wyszukiwarką oraz siatkę wyróżnionych ofert.
*   **Układ:** Sticky Header + Hero Section + CSS Grid (oferty).
*   **RWD:** Na urządzeniach mobilnych siatka ofert zmienia się w układ kolumnowy (1 kolumna).

![Zrzut ekranu - Strona Główna](images/DreamHome-home.jpeg)

#### 9.2. Widok Szczegółów Ogłoszenia (Listing Details)
Widok prezentujący szczegółowe dane oferty.
*   **Układ:** Dwie kolumny (Lewa: Galeria zdjęć i opis, Prawa: Panel kontaktowy i cena).
*   **RWD:** Na smartfonach prawa kolumna przesuwa się pod sekcję opisu (stacking).

![Zrzut ekranu - Szczegóły Ogłoszenia](images/DreamHome-listing.jpeg)

#### 9.3. Widok Panelu Agenta (Dashboard)
Panel zarządzania dla zalogowanego użytkownika (Agenta/Administratora).
*   **Układ:** Panel boczny (Sidebar) z menu + Główny obszar roboczy z tabelą danych.
*   **Funkcje:** Tabela z listą dodanych ogłoszeń, przyciski akcji (Edytuj, Usuń), statusy ofert.

![Zrzut ekranu - Panel Agenta](images/DreamHome-dashboard.jpeg)


---

### 10. Technologie i rozwiązania
Projekt zostanie zrealizowany w dwóch wariantach technologicznych (zgodnie z wymogami laboratoriów):

1.  **Wersja Java:**
    * **Backend:** Java, Spring Boot (Spring MVC).
    * **ORM:** Hibernate / Spring Data JPA.
    * **Widok:** Thymeleaf lub JSP.
2.  **Wersja PHP:**
    * **Backend:** Czysty PHP / Laravel
    * **Baza danych:** PostgreSQL
3.  **Frontend (Wspólny):**
    * HTML5, CSS3 (Bootstrap 5 dla responsywności).
    * Podstawowy JavaScript (walidacja frontendowa).
4.  **Narzędzia:**
    * Git (kontrola wersji).
    * Maven (Java) / Composer (PHP).