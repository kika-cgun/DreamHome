package com.piotrcapecki.dreamhome.config;

import com.piotrcapecki.dreamhome.entity.*;
import com.piotrcapecki.dreamhome.enums.ListingStatus;
import com.piotrcapecki.dreamhome.enums.ListingType;
import com.piotrcapecki.dreamhome.enums.Role;
import com.piotrcapecki.dreamhome.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

        private final UserRepository userRepository;
        private final CategoryRepository categoryRepository;
        private final LocationRepository locationRepository;
        private final ListingRepository listingRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) throws Exception {
                if (userRepository.count() == 0) {
                        seedUsers();
                }
                if (categoryRepository.count() == 0) {
                        seedCategories();
                }
                if (locationRepository.count() == 0) {
                        seedLocations();
                }
                if (listingRepository.count() == 0) {
                        seedListings();
                }
        }

        private void seedUsers() {
                User admin = User.builder()
                                .email("admin@dreamhome.com")
                                .password(passwordEncoder.encode("admin123"))
                                .firstName("Admin")
                                .lastName("System")
                                .role(Role.ADMIN)
                                .build();

                User agent1 = User.builder()
                                .email("agent@dreamhome.com")
                                .password(passwordEncoder.encode("agent123"))
                                .firstName("Piotr")
                                .lastName("Kowalski")
                                .phone("501234567")
                                .role(Role.AGENT)
                                .agencyName("Kowalski Nieruchomości")
                                .build();

                User agent2 = User.builder()
                                .email("agent2@dreamhome.com")
                                .password(passwordEncoder.encode("agent123"))
                                .firstName("Anna")
                                .lastName("Nowak")
                                .phone("502345678")
                                .role(Role.AGENT)
                                .agencyName("Property Expert")
                                .build();

                User user = User.builder()
                                .email("user@dreamhome.com")
                                .password(passwordEncoder.encode("user123"))
                                .firstName("Jan")
                                .lastName("Wiśniewski")
                                .phone("503456789")
                                .role(Role.USER)
                                .build();

                userRepository.saveAll(List.of(admin, agent1, agent2, user));
                System.out.println("Użytkownicy zasileni");
        }

        private void seedCategories() {
                Category mieszkanie = Category.builder().name("Mieszkanie").description("Mieszkania i apartamenty")
                                .build();
                Category dom = Category.builder().name("Dom").description("Domy jednorodzinne i wille").build();
                Category dzialka = Category.builder().name("Działka").description("Działki budowlane i rekreacyjne")
                                .build();
                Category lokal = Category.builder().name("Lokal użytkowy").description("Lokale handlowe i usługowe")
                                .build();
                Category biuro = Category.builder().name("Biuro").description("Powierzchnie biurowe").build();

                categoryRepository.saveAll(List.of(mieszkanie, dom, dzialka, lokal, biuro));
                System.out.println("Kategorie zasilone");
        }

        private void seedLocations() {
                Location warszawa = Location.builder()
                                .city("Warszawa").district("Mokotów")
                                .imageUrl("https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=800").build();

                Location krakow = Location.builder()
                                .city("Kraków").district("Stare Miasto")
                                .imageUrl("https://images.unsplash.com/photo-1636903364559-0dfc358abd94?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA==")
                                .build();

                Location gdansk = Location.builder()
                                .city("Gdańsk").district("Wrzeszcz")
                                .imageUrl("https://images.unsplash.com/photo-1683137805526-7ebe6f361286?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA==")
                                .build();

                Location wroclaw = Location.builder()
                                .city("Wrocław").district("Krzyki")
                                .imageUrl("https://media.istockphoto.com/photos/centre-of-wroclaw-poland-picture-id175446435?b=1&k=20&m=175446435&s=170667a&w=0&h=vPRpUYOMt0230gokgVDrIisF9WimA8brDXXhbWeAuZU=")
                                .build();

                Location poznan = Location.builder()
                                .city("Poznań").district("Jeżyce")
                                .imageUrl("https://media.istockphoto.com/id/1212569606/photo/old-market-square-poznan.jpg?b=1&s=170667a&w=0&k=20&c=rMT5tKaruacipIfsB9J8nH1PTkdJCFw03moNC69BN-o=")
                                .build();

                Location gdynia = Location.builder()
                                .city("Gdynia").district("Śródmieście")
                                .imageUrl("https://images.unsplash.com/photo-1640727272714-58e6fce66278?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA==")
                                .build();

                Location sopot = Location.builder()
                                .city("Sopot").district("Dolny Sopot")
                                .imageUrl("https://media.istockphoto.com/id/1387453827/photo/holidays-in-poland-view-of-the-sopot-health-resort-in-the-morning.jpg?b=1&s=170667a&w=0&k=20&c=kXOq_xhIdVvaiHuPwLHQOuKAPxDgJ4wZfyFYFZnfy-g=")
                                .build();

                Location lodz = Location.builder()
                                .city("Łódź").district("Śródmieście")
                                .imageUrl("https://images.unsplash.com/photo-1652345254712-8988e67e0330?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA==")
                                .build();

                Location katowice = Location.builder()
                                .city("Katowice").district("Centrum")
                                .imageUrl("https://media.istockphoto.com/id/1612362586/fr/photo/vue-a%C3%A9rienne-de-katowice-rynek-sil%C3%A9sie-en-pologne.webp?a=1&b=1&s=612x612&w=0&k=20&c=nk-hCBjdSVhS5_LA_dLZhp_0B-LeSxxH8O4hgKXdAT0=")
                                .build();

                Location szczecin = Location.builder()
                                .city("Szczecin").district("Niebuszewo")
                                .imageUrl("https://media.istockphoto.com/photos/autumn-aerial-view-of-the-monumental-buildings-in-haken-terrace-picture-id1353633411?b=1&k=20&m=1353633411&s=170667a&w=0&h=vDU5KYY7OcZvqSmaeL9SGEvlgJO58S82wB5V-ErQrLE=")
                                .build();

                locationRepository.saveAll(List.of(warszawa, krakow, gdansk, wroclaw, poznan, gdynia, sopot, lodz,
                                katowice, szczecin));
                System.out.println("Lokalizacje zasilone (10 miast)");
        }

        private void seedListings() {
                User agent1 = userRepository.findByEmail("agent@dreamhome.com").orElseThrow();
                User agent2 = userRepository.findByEmail("agent2@dreamhome.com").orElseThrow();

                Category mieszkanie = categoryRepository.findByName("Mieszkanie").orElseThrow();
                Category dom = categoryRepository.findByName("Dom").orElseThrow();
                Category dzialka = categoryRepository.findByName("Działka").orElseThrow();
                Category lokal = categoryRepository.findByName("Lokal użytkowy").orElseThrow();
                Category biuro = categoryRepository.findByName("Biuro").orElseThrow();

                Location warszawa = locationRepository.findAll().stream().filter(l -> l.getCity().equals("Warszawa"))
                                .findFirst().orElseThrow();
                Location krakow = locationRepository.findAll().stream().filter(l -> l.getCity().equals("Kraków"))
                                .findFirst().orElseThrow();
                Location gdansk = locationRepository.findAll().stream().filter(l -> l.getCity().equals("Gdańsk"))
                                .findFirst().orElseThrow();
                Location wroclaw = locationRepository.findAll().stream().filter(l -> l.getCity().equals("Wrocław"))
                                .findFirst().orElseThrow();
                Location poznan = locationRepository.findAll().stream().filter(l -> l.getCity().equals("Poznań"))
                                .findFirst().orElseThrow();
                Location gdynia = locationRepository.findAll().stream().filter(l -> l.getCity().equals("Gdynia"))
                                .findFirst().orElseThrow();
                Location sopot = locationRepository.findAll().stream().filter(l -> l.getCity().equals("Sopot"))
                                .findFirst().orElseThrow();
                Location lodz = locationRepository.findAll().stream().filter(l -> l.getCity().equals("Łódź"))
                                .findFirst().orElseThrow();
                Location katowice = locationRepository.findAll().stream().filter(l -> l.getCity().equals("Katowice"))
                                .findFirst().orElseThrow();
                Location szczecin = locationRepository.findAll().stream().filter(l -> l.getCity().equals("Szczecin"))
                                .findFirst().orElseThrow();

                // === SPRZEDAŻ ===

                // 1. Luksusowy apartament Warszawa
                Listing listing1 = createListing(
                                "Luksusowy apartament z widokiem na Pałac Kultury",
                                "Wyjątkowy apartament o wysokim standardzie wykończenia. Przestronne wnętrza z panoramicznym widokiem na centrum Warszawy. W cenie miejsce parkingowe w garażu podziemnym oraz komórka lokatorska.",
                                BigDecimal.valueOf(1850000), BigDecimal.valueOf(92.5), 3, "18",
                                ListingType.SALE, agent1, mieszkanie, warszawa, "Warszawa", "Śródmieście",
                                List.of("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
                                                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"));

                // 2. Przytulna kawalerka Kraków
                Listing listing2 = createListing(
                                "Przytulna kawalerka w sercu Kazimierza",
                                "Urokliwa kawalerka w zabytkowej kamienicy po generalnym remoncie. Idealna jako inwestycja pod wynajem krótkoterminowy. Wysoki standard wykończenia, klimatyzacja.",
                                BigDecimal.valueOf(489000), BigDecimal.valueOf(28.0), 1, "2",
                                ListingType.SALE, agent2, mieszkanie, krakow, "Kraków", "Kazimierz",
                                List.of("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"));

                // 3. Dom z ogrodem Gdańsk
                Listing listing3 = createListing(
                                "Nowoczesny dom z ogrodem blisko morza",
                                "Przestronny dom jednorodzinny w zielonej okolicy. Działka 800m², ogrzewanie podłogowe, pompa ciepła, fotowoltaika. Garaż dwustanowiskowy, taras z widokiem na ogród.",
                                BigDecimal.valueOf(1650000), BigDecimal.valueOf(185.0), 5, "parter + piętro",
                                ListingType.SALE, agent1, dom, gdansk, "Gdańsk", "Osowa",
                                List.of("https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
                                                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"));

                // 4. Mieszkanie Wrocław
                Listing listing4 = createListing(
                                "Słoneczne 3-pokojowe mieszkanie na Krzykach",
                                "Jasne mieszkanie z dużym balkonem, idealne dla rodziny. Blisko szkoły, przedszkola i parku. Ciche osiedle, niski czynsz. Piwnica w cenie.",
                                BigDecimal.valueOf(599000), BigDecimal.valueOf(68.0), 3, "4",
                                ListingType.SALE, agent2, mieszkanie, wroclaw, "Wrocław", "Krzyki",
                                List.of("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"));

                // 5. Działka budowlana Poznań
                Listing listing5 = createListing(
                                "Działka budowlana w spokojnej okolicy",
                                "Działka w pełni uzbrojona (woda, prąd, gaz, kanalizacja). Kształt prostokątny, idealna pod dom jednorodzinny. Media przy granicy działki.",
                                BigDecimal.valueOf(320000), BigDecimal.valueOf(1200.0), null, null,
                                ListingType.SALE, agent1, dzialka, poznan, "Poznań", "Morasko",
                                List.of("https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"));

                // 6. Mieszkanie Szczecin
                Listing listing6 = createListing(
                                "Przestronne mieszkanie z garażem",
                                "Atrakcyjne 4-pokojowe mieszkanie w nowym budownictwie. Duży balkon, piwnica, miejsce w garażu podziemnym. Cicha okolica.",
                                BigDecimal.valueOf(485000), BigDecimal.valueOf(78.0), 4, "3",
                                ListingType.SALE, agent2, mieszkanie, szczecin, "Szczecin", "Niebuszewo",
                                List.of("https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800"));

                // === WYNAJEM ===

                // 7. Wynajem mieszkania Gdynia
                Listing rental1 = createListing(
                                "Nowoczesne mieszkanie z widokiem na morze",
                                "Eleganckie 2-pokojowe mieszkanie z tarasem i widokiem na zatokę. W pełni wyposażone i umeblowane. Miejsce parkingowe w cenie.",
                                BigDecimal.valueOf(3800), BigDecimal.valueOf(52.0), 2, "8",
                                ListingType.RENT, agent1, mieszkanie, gdynia, "Gdynia", "Śródmieście",
                                List.of("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
                                                "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"));

                // 8. Wynajem studio Sopot
                Listing rental2 = createListing(
                                "Przytulne studio przy molo w Sopocie",
                                "Klimatyczne studio w ścisłym centrum Sopotu, 5 minut spacerem do mola i plaży. Idealne na wakacje lub krótkoterminowy pobyt.",
                                BigDecimal.valueOf(4500), BigDecimal.valueOf(35.0), 1, "1",
                                ListingType.RENT, agent2, mieszkanie, sopot, "Sopot", "Centrum",
                                List.of("https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"));

                // 9. Wynajem domu Warszawa
                Listing rental3 = createListing(
                                "Przestronny dom w zielonej okolicy Wilanowa",
                                "Luksusowy dom do wynajęcia w prestiżowej dzielnicy. 4 sypialnie, 3 łazienki, duży ogród z tarasem. Idealne dla rodziny z dziećmi.",
                                BigDecimal.valueOf(12000), BigDecimal.valueOf(220.0), 5, "2 piętra",
                                ListingType.RENT, agent1, dom, warszawa, "Warszawa", "Wilanów",
                                List.of("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"));

                // 10. Lokal użytkowy Łódź
                Listing rental4 = createListing(
                                "Lokal handlowy w centrum Łodzi",
                                "Lokal na parterze w kamienicy przy głównej ulicy handlowej. Duża witryna, zaplecze socjalne, klimatyzacja.",
                                BigDecimal.valueOf(5500), BigDecimal.valueOf(85.0), 2, "parter",
                                ListingType.RENT, agent2, lokal, lodz, "Łódź", "Śródmieście",
                                List.of("https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"));

                // 11. Biuro Katowice
                Listing rental5 = createListing(
                                "Nowoczesna powierzchnia biurowa w centrum",
                                "Biuro w nowoczesnym biurowcu klasy A. Open space z możliwością aranżacji. Klimatyzacja, recepcja 24/7, parking podziemny.",
                                BigDecimal.valueOf(8500), BigDecimal.valueOf(120.0), 3, "12",
                                ListingType.RENT, agent1, biuro, katowice, "Katowice", "Centrum",
                                List.of("https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
                                                "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800"));

                // 12. Kawalerka wynajem Kraków
                Listing rental6 = createListing(
                                "Stylowa kawalerka dla studenta przy AGH",
                                "Nowocześnie urządzona kawalerka w pobliżu uczelni AGH. Internet w cenie, w pełni umeblowana. Idealna dla studenta.",
                                BigDecimal.valueOf(1800), BigDecimal.valueOf(24.0), 1, "4",
                                ListingType.RENT, agent2, mieszkanie, krakow, "Kraków", "Krowodrza",
                                List.of("https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"));

                listingRepository.saveAll(List.of(listing1, listing2, listing3, listing4, listing5, listing6,
                                rental1, rental2, rental3, rental4, rental5, rental6));
                System.out.println("Ogłoszenia zasilone (6 sprzedaż, 6 wynajem)");
        }

        private Listing createListing(String title, String description, BigDecimal price, BigDecimal area,
                        Integer rooms, String floor, ListingType type, User user,
                        Category category, Location location, String city, String district,
                        List<String> imageUrls) {
                Listing listing = Listing.builder()
                                .title(title)
                                .description(description)
                                .price(price)
                                .area(area)
                                .rooms(rooms)
                                .floor(floor)
                                .type(type)
                                .status(ListingStatus.ACTIVE)
                                .user(user)
                                .category(category)
                                .location(location)
                                .city(city)
                                .district(district)
                                .images(new ArrayList<>())
                                .build();

                List<ListingImage> images = new ArrayList<>();
                for (int i = 0; i < imageUrls.size(); i++) {
                        images.add(ListingImage.builder()
                                        .listing(listing)
                                        .imageUrl(imageUrls.get(i))
                                        .isPrimary(i == 0)
                                        .sortOrder(i)
                                        .build());
                }
                listing.setImages(images);
                return listing;
        }
}
