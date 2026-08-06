<?php

use App\Helpers\Helper;

if (!function_exists('get_site_logo')) {
    /**
     * Get site logo URL using Helper
     *
     * @return string|null
     */
    function get_site_logo(): ?string
    {
        return Helper::getSiteLogo();
    }
}
