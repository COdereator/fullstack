import React, { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-indigo-600">Exchange of Product</Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <NavLink
                to="/"
                className={`${
                  isActive('/') ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:text-gray-900 hover:border-gray-300`}
              >
                Home
              </NavLink>
              <NavLink
                to="/browse"
                className={`${
                  isActive('/browse') ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:text-gray-900 hover:border-gray-300`}
              >
                Browse
              </NavLink>
              {isAuthenticated && (
                <>
                  <NavLink
                    to="/add-product"
                    className={`${
                      isActive('/add-product') ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:text-gray-900 hover:border-gray-300`}
                  >
                    Add Product
                  </NavLink>
                  <NavLink
                    to="/my-trades"
                    className={`${
                      isActive('/my-trades') ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:text-gray-900 hover:border-gray-300`}
                  >
                    My Trades
                  </NavLink>
                </>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/signin"
                  className="text-gray-700 hover:text-indigo-600 transition-colors duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <NavLink
              to="/"
              className={`${
                isActive('/') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'
              } block pl-3 pr-4 py-2 text-base font-medium hover:bg-gray-50 hover:text-gray-900`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/browse"
              className={`${
                isActive('/browse') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'
              } block pl-3 pr-4 py-2 text-base font-medium hover:bg-gray-50 hover:text-gray-900`}
              onClick={() => setIsMenuOpen(false)}
            >
              Browse
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink
                  to="/add-product"
                  className={`${
                    isActive('/add-product') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'
                  } block pl-3 pr-4 py-2 text-base font-medium hover:bg-gray-50 hover:text-gray-900`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Add Product
                </NavLink>
                <NavLink
                  to="/my-trades"
                  className={`${
                    isActive('/my-trades') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'
                  } block pl-3 pr-4 py-2 text-base font-medium hover:bg-gray-50 hover:text-gray-900`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Trades
                </NavLink>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4 space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700">Welcome, {user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="block text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/signin"
                    className="block text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block bg-indigo-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 
