<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class NewsArticleTest extends TestCase
{
    /**
     * Testing News Artical Fetching Successfully...
     */
    public function test_news_available(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
