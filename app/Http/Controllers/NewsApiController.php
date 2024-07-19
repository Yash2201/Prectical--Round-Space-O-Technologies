<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;
use \Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;

class NewsApiController extends Controller
{
    function getNews(Request $request) 
    {   
        $url = 'https://newsapi.org/v2/top-headlines?country=in&apiKey='.config('app.news_api_key');

        $response = Http::get($url);

        if($response->successful()){
            $resultData = $response->json();
            $articles = collect($resultData['articles']);
            $perPage = 10;
            $currentPage = $request->input('page', 1);

            // Paginate the articles collection
            $paginatedArticles = new LengthAwarePaginator(
                $articles->forPage($currentPage, $perPage),
                $articles->count(),
                $perPage,
                $currentPage,
                ['path' => url()->current()]
            );

            return Inertia::render('NewsView', [
                'news' => $paginatedArticles,
            ]);

        } else if($response->failed()) {
            return Inertia::render('NewsView', [
                'news' => []
            ]);
        }
    }
}
