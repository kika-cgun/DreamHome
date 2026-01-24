<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Location;
use App\Models\Listing;
use App\Models\ListingImage;
use App\Enums\Role;
use App\Enums\ListingType;
use App\Enums\ListingStatus;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // === UŻYTKOWNICY ===
        $admin = User::create([
            'email' => 'admin@dreamhome.com',
            'password' => 'admin123',
            'first_name' => 'Admin',
            'last_name' => 'System',
            'role' => Role::ADMIN->value,
        ]);

        $agent1 = User::create([
            'email' => 'agent@dreamhome.com',
            'password' => 'agent123',
            'first_name' => 'Piotr',
            'last_name' => 'Kowalski',
            'phone' => '501234567',
            'agency_name' => 'Kowalski Nieruchomości',
            'role' => Role::AGENT->value,
        ]);

        $agent2 = User::create([
            'email' => 'agent2@dreamhome.com',
            'password' => 'agent123',
            'first_name' => 'Anna',
            'last_name' => 'Nowak',
            'phone' => '502345678',
            'agency_name' => 'Property Expert',
            'role' => Role::AGENT->value,
        ]);

        $user = User::create([
            'email' => 'user@dreamhome.com',
            'password' => 'user123',
            'first_name' => 'Jan',
            'last_name' => 'Wiśniewski',
            'phone' => '503456789',
            'role' => Role::USER->value,
        ]);

        // === KATEGORIE ===
        $mieszkanie = Category::create([
            'name' => 'Mieszkanie',
            'description' => 'Mieszkania i apartamenty',
        ]);

        $dom = Category::create([
            'name' => 'Dom',
            'description' => 'Domy jednorodzinne i wille',
        ]);

        $dzialka = Category::create([
            'name' => 'Działka',
            'description' => 'Działki budowlane i rekreacyjne',
        ]);

        $lokal = Category::create([
            'name' => 'Lokal użytkowy',
            'description' => 'Lokale handlowe i usługowe',
        ]);

        $biuro = Category::create([
            'name' => 'Biuro',
            'description' => 'Powierzchnie biurowe',
        ]);

        // === LOKALIZACJE (z polskimi znakami i zdjęciami) ===
        $warszawa = Location::create([
            'city' => 'Warszawa',
            'district' => 'Mokotów',
            'image_url' => 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=800',
        ]);

        $krakow = Location::create([
            'city' => 'Kraków',
            'district' => 'Stare Miasto',
            'image_url' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        ]);

        $gdansk = Location::create([
            'city' => 'Gdańsk',
            'district' => 'Wrzeszcz',
            'image_url' => 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800',
        ]);

        $wroclaw = Location::create([
            'city' => 'Wrocław',
            'district' => 'Krzyki',
            'image_url' => 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800',
        ]);

        $poznan = Location::create([
            'city' => 'Poznań',
            'district' => 'Jeżyce',
            'image_url' => 'https://images.unsplash.com/photo-1577415124269-fc1140a69e91?w=800',
        ]);

        $gdynia = Location::create([
            'city' => 'Gdynia',
            'district' => 'Śródmieście',
            'image_url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        ]);

        $sopot = Location::create([
            'city' => 'Sopot',
            'district' => 'Dolny Sopot',
            'image_url' => 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        ]);

        $lodz = Location::create([
            'city' => 'Łódź',
            'district' => 'Śródmieście',
            'image_url' => 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        ]);

        $katowice = Location::create([
            'city' => 'Katowice',
            'district' => 'Centrum',
            'image_url' => 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
        ]);

        $szczecin = Location::create([
            'city' => 'Szczecin',
            'district' => 'Niebuszewo',
            'image_url' => 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
        ]);

        // === OGŁOSZENIA - SPRZEDAŻ ===

        // 1. Luksusowy apartament Warszawa
        $listing1 = Listing::create([
            'title' => 'Luksusowy apartament z widokiem na Pałac Kultury',
            'description' => 'Wyjątkowy apartament o wysokim standardzie wykończenia. Przestronne wnętrza z panoramicznym widokiem na centrum Warszawy. W cenie miejsce parkingowe w garażu podziemnym oraz komórka lokatorska. Budynek z ochroną 24/7, siłownią i strefą relaksu.',
            'price' => 1850000,
            'area' => 92.5,
            'rooms' => 3,
            'floor' => '18',
            'type' => ListingType::SALE->value,
            'status' => ListingStatus::ACTIVE->value,
            'city' => 'Warszawa',
            'district' => 'Śródmieście',
            'user_id' => $agent1->id,
            'category_id' => $mieszkanie->id,
            'location_id' => $warszawa->id,
        ]);
        $this->addImages($listing1, [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        ]);

        // 2. Przytulna kawalerka Kraków
        $listing2 = Listing::create([
            'title' => 'Przytulna kawalerka w sercu Kazimierza',
            'description' => 'Urokliwa kawalerka w zabytkowej kamienicy po generalnym remoncie. Idealna jako inwestycja pod wynajem krótkoterminowy. Wysoki standard wykończenia, klimatyzacja, w pełni wyposażona.',
            'price' => 489000,
            'area' => 28.0,
            'rooms' => 1,
            'floor' => '2',
            'type' => ListingType::SALE->value,
            'status' => ListingStatus::ACTIVE->value,
            'city' => 'Kraków',
            'district' => 'Kazimierz',
            'user_id' => $agent2->id,
            'category_id' => $mieszkanie->id,
            'location_id' => $krakow->id,
        ]);
        $this->addImages($listing2, [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        ]);

        // 3. Dom z ogrodem Gdańsk
        $listing3 = Listing::create([
            'title' => 'Nowoczesny dom z ogrodem blisko morza',
            'description' => 'Przestronny dom jednorodzinny w zielonej okolicy. Działka 800m², ogrzewanie podłogowe, pompa ciepła, fotowoltaika. Garaż dwustanowiskowy, taras z widokiem na ogród. 15 minut do plaży samochodem.',
            'price' => 1650000,
            'area' => 185.0,
            'rooms' => 5,
            'floor' => 'parter + piętro',
            'type' => ListingType::SALE->value,
            'status' => ListingStatus::ACTIVE->value,
            'city' => 'Gdańsk',
            'district' => 'Osowa',
            'user_id' => $agent1->id,
            'category_id' => $dom->id,
            'location_id' => $gdansk->id,
        ]);
        $this->addImages($listing3, [
            'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
        ]);

        // 4. Mieszkanie Wrocław
        $listing4 = Listing::create([
            'title' => 'Słoneczne 3-pokojowe mieszkanie na Krzykach',
            'description' => 'Jasne mieszkanie z dużym balkonem, idealne dla rodziny. Blisko szkoły, przedszkola i parku. Ciche osiedle, niski czynsz. Piwnica w cenie.',
            'price' => 599000,
            'area' => 68.0,
            'rooms' => 3,
            'floor' => '4',
            'type' => ListingType::SALE->value,
            'status' => ListingStatus::ACTIVE->value,
            'city' => 'Wrocław',
            'district' => 'Krzyki',
            'user_id' => $agent2->id,
            'category_id' => $mieszkanie->id,
            'location_id' => $wroclaw->id,
        ]);
        $this->addImages($listing4, [
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        ]);

        // 5. Działka budowlana Poznań
        $listing5 = Listing::create([
            'title' => 'Działka budowlana w spokojnej okolicy',
            'description' => 'Działka w pełni uzbrojona (woda, prąd, gaz, kanalizacja). Kształt prostokątny, idealna pod dom jednorodzinny. Media przy granicy działki. Plan zagospodarowania przestrzennego pozwala na budowę domu do 2 kondygnacji.',
            'price' => 320000,
            'area' => 1200.0,
            'rooms' => null,
            'floor' => null,
            'type' => ListingType::SALE->value,
            'status' => ListingStatus::ACTIVE->value,
            'city' => 'Poznań',
            'district' => 'Morasko',
            'user_id' => $agent1->id,
            'category_id' => $dzialka->id,
            'location_id' => $poznan->id,
        ]);
        $this->addImages($listing5, [
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
        ]);

        // === OGŁOSZENIA - WYNAJEM ===

        // 6. Wynajem mieszkania Gdynia
        $rental1 = Listing::create([
            'title' => 'Nowoczesne mieszkanie z widokiem na morze',
            'description' => 'Eleganckie 2-pokojowe mieszkanie z tarasem i widokiem na zatokę. W pełni wyposażone i umeblowane. Miejsce parkingowe w cenie. Idealne dla pary lub singla. Dostępne od zaraz.',
            'price' => 3800,
            'area' => 52.0,
            'rooms' => 2,
            'floor' => '8',
            'type' => ListingType::RENT->value,
            'status' => ListingStatus::ACTIVE->value,
            'city' => 'Gdynia',
            'district' => 'Śródmieście',
            'user_id' => $agent1->id,
            'category_id' => $mieszkanie->id,
            'location_id' => $gdynia->id,
        ]);
        $this->addImages($rental1, [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
        ]);

        // 7. Wynajem pokoju Sopot
        $rental2 = Listing::create([
            'title' => 'Przytulne studio przy molo w Sopocie',
            'description' => 'Klimatyczne studio w ścisłym centrum Sopotu, 5 minut spacerem do mola i plaży. Idealne na wakacje lub krótkoterminowy pobyt. W pełni wyposażone.',
            'price' => 4500,
            'area' => 35.0,
            'rooms' => 1,
            'floor' => '1',
            'type' => ListingType::RENT->value,
            'status' => ListingStatus::ACTIVE->value,
            'city' => 'Sopot',
            'district' => 'Centrum',
            'user_id' => $agent2->id,
            'category_id' => $mieszkanie->id,
            'location_id' => $sopot->id,
        ]);
        $this->addImages($rental2, [
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        ]);

        // 8. Wynajem domu Warszawa
        $rental3 = Listing::create([
            'title' => 'Przestronny dom w zielonej okolicy Wilanowa',
            'description' => 'Luksusowy dom do wynajęcia w prestiżowej dzielnicy. 4 sypialnie, 3 łazienki, duży ogród z tarasem. Idealne dla rodziny z dziećmi lub osób pracujących z domu.',
            'price' => 12000,
            'area' => 220.0,
            'rooms' => 5,
            'floor' => '2 piętra',
            'type' => ListingType::RENT->value,
            'status' => ListingStatus::ACTIVE->value,
            'city' => 'Warszawa',
            'district' => 'Wilanów',
            'user_id' => $agent1->id,
            'category_id' => $dom->id,
            'location_id' => $warszawa->id,
        ]);
        $this->addImages($rental3, [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
            'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800',
        ]);

        // 9. Lokal użytkowy Łódź
        $rental4 = Listing::create([
            'title' => 'Lokal handlowy w centrum Łodzi',
            'description' => 'Lokal na parterze w kamienicy przy głównej ulicy handlowej. Duża witryna, zaplecze socjalne, klimatyzacja. Idealny na sklep, kawiarnię lub punkt usługowy.',
            'price' => 5500,
            'area' => 85.0,
            'rooms' => 2,
            'floor' => 'parter',
            'type' => ListingType::RENT->value,
            'status' => ListingStatus::ACTIVE->value,
            'city' => 'Łódź',
            'district' => 'Śródmieście',
            'user_id' => $agent2->id,
            'category_id' => $lokal->id,
            'location_id' => $lodz->id,
        ]);
        $this->addImages($rental4, [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        ]);

        // 10. Biuro Katowice
        $rental5 = Listing::create([
            'title' => 'Nowoczesna powierzchnia biurowa w centrum',
            'description' => 'Biuro w nowoczesnym biurowcu klasy A. Open space z możliwością aranżacji. Klimatyzacja, recepcja 24/7, parking podziemny. Blisko dworca PKP.',
            'price' => 8500,
            'area' => 120.0,
            'rooms' => 3,
            'floor' => '12',
            'type' => ListingType::RENT->value,
            'status' => ListingStatus::ACTIVE->value,
            'city' => 'Katowice',
            'district' => 'Centrum',
            'user_id' => $agent1->id,
            'category_id' => $biuro->id,
            'location_id' => $katowice->id,
        ]);
        $this->addImages($rental5, [
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
            'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
        ]);

        // 11. Mieszkanie Szczecin
        $listing6 = Listing::create([
            'title' => 'Przestronne mieszkanie z garażem',
            'description' => 'Atrakcyjne 4-pokojowe mieszkanie w nowym budownictwie. Duży balkon, piwnica, miejsce w garażu podziemnym. Cicha okolica, dobra komunikacja z centrum.',
            'price' => 485000,
            'area' => 78.0,
            'rooms' => 4,
            'floor' => '3',
            'type' => ListingType::SALE->value,
            'status' => ListingStatus::ACTIVE->value,
            'city' => 'Szczecin',
            'district' => 'Niebuszewo',
            'user_id' => $agent2->id,
            'category_id' => $mieszkanie->id,
            'location_id' => $szczecin->id,
        ]);
        $this->addImages($listing6, [
            'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800',
        ]);

        // 12. Kawalerka wynajem Kraków
        $rental6 = Listing::create([
            'title' => 'Stylowa kawalerka dla studenta przy AGH',
            'description' => 'Nowocześnie urządzona kawalerka w pobliżu uczelni AGH. Internet w cenie, w pełni umeblowana. Idealna dla studenta lub młodego pracownika.',
            'price' => 1800,
            'area' => 24.0,
            'rooms' => 1,
            'floor' => '4',
            'type' => ListingType::RENT->value,
            'status' => ListingStatus::ACTIVE->value,
            'city' => 'Kraków',
            'district' => 'Krowodrza',
            'user_id' => $agent1->id,
            'category_id' => $mieszkanie->id,
            'location_id' => $krakow->id,
        ]);
        $this->addImages($rental6, [
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
        ]);

        echo "Baza danych zasilona pomyślnie! (6 sprzedaż, 6 wynajem, 10 lokalizacji)\n";
    }

    private function addImages(Listing $listing, array $urls): void
    {
        foreach ($urls as $index => $url) {
            ListingImage::create([
                'listing_id' => $listing->id,
                'image_url' => $url,
                'is_primary' => $index === 0,
                'sort_order' => $index,
            ]);
        }
    }
}
