<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NewsApiController;

Route::get('/', [NewsApiController::class,'getNews'])->name('home');