<?php

namespace App\Enums;

enum Role: string
{
    case USER = 'USER';
    case AGENT = 'AGENT';
    case ADMIN = 'ADMIN';
}
