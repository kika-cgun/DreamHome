<?php

namespace App\Enums;

enum ListingStatus: string
{
    case ACTIVE = 'ACTIVE';
    case RESERVED = 'RESERVED';
    case SOLD = 'SOLD';
    case EXPIRED = 'EXPIRED';
}
