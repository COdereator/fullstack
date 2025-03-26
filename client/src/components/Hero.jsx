import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-100 to-white">
      {/* Decorative circles */}
      <div className="hidden lg:block lg:absolute lg:inset-0">
        <svg
          className="absolute right-full translate-y-1/4 translate-x-1/4 transform lg:translate-x-1/2"
          width="404"
          height="784"
          fill="none"
          viewBox="0 0 404 784"
        >
          <defs>
            <pattern
              id="pattern-1"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" className="text-indigo-200" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="404" height="784" fill="url(#pattern-1)" />
        </svg>
      </div>

      <div className="relative pt-6 pb-16 sm:pb-24">
        <main className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6 lg:mt-32">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
              <h1>
                <span className="block text-base font-semibold text-indigo-600">
                  Welcome to SwapSpot
                </span>
                <span className="mt-1 block text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl">
                  <span className="block text-gray-900">Trade Smarter</span>
                  <span className="block text-indigo-600">Exchange Better</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Join our vibrant community where you can trade items, discover unique products, and connect with people who share your interests. Start your trading journey today!
              </p>
              <div className="mt-8 sm:mx-auto sm:max-w-lg sm:text-center lg:mx-0 lg:text-left">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Link
                    to="/signup"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/browse"
                    className="flex w-full items-center justify-center rounded-md border border-indigo-300 bg-white px-4 py-3 text-base font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Browse Products
                  </Link>
                </div>
                <div className="mt-6 flex items-center justify-center lg:justify-start">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <img
                        key={i}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                        src={`https://randomuser.me/api/portraits/men/${i}.jpg`}
                        alt=""
                      />
                    ))}
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-500">
                    Join 5,000+ members already trading
                  </span>
                </div>
              </div>
            </div>
            <div className="relative mt-12 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:max-w-none lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full overflow-hidden rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <img
                    className="w-full"
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                    alt="Product exchange marketplace"
                  />
                  <div className="absolute inset-0 bg-indigo-600 mix-blend-multiply opacity-20"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Stats Section */}
      <div className="relative bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Active Users</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-indigo-600">5,000+</dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Products Listed</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-indigo-600">10,000+</dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Successful Trades</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-indigo-600">15,000+</dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Categories</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-indigo-600">50+</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

export default Hero 