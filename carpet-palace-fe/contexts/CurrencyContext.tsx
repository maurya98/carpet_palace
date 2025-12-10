'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Country to currency mapping
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: 'USD',
  CA: 'CAD',
  GB: 'GBP',
  AU: 'AUD',
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  CH: 'CHF',
  AT: 'EUR',
  SE: 'SEK',
  NO: 'NOK',
  DK: 'DKK',
  FI: 'EUR',
  JP: 'JPY',
  CN: 'CNY',
  IN: 'INR',
  AE: 'AED',
  SA: 'SAR',
  SG: 'SGD',
  HK: 'HKD',
  NZ: 'NZD',
  MX: 'MXN',
  BR: 'BRL',
  AR: 'ARS',
  ZA: 'ZAR',
}

// Exchange rates relative to INR (1 INR = X units of other currency)
// Approximate rates - in production, fetch from API
const EXCHANGE_RATES: Record<string, number> = {
  INR: 1.0,        // Base currency
  USD: 0.012048,  // 1 INR = 0.012048 USD (1 USD = 83 INR)
  CAD: 0.016260,  // 1 INR = 0.016260 CAD (1 CAD = 61.48 INR)
  GBP: 0.009524,  // 1 INR = 0.009524 GBP (1 GBP = 105.06 INR)
  AUD: 0.018315,  // 1 INR = 0.018315 AUD (1 AUD = 54.61 INR)
  EUR: 0.011084,  // 1 INR = 0.011084 EUR (1 EUR = 90.22 INR)
  CHF: 0.010601,  // 1 INR = 0.010601 CHF (1 CHF = 94.32 INR)
  SEK: 0.126582,  // 1 INR = 0.126582 SEK (1 SEK = 7.90 INR)
  NOK: 0.128972,  // 1 INR = 0.128972 NOK (1 NOK = 7.76 INR)
  DKK: 0.082771,  // 1 INR = 0.082771 DKK (1 DKK = 12.08 INR)
  JPY: 1.807229,  // 1 INR = 1.807229 JPY (1 JPY = 0.553 INR)
  CNY: 0.086747,  // 1 INR = 0.086747 CNY (1 CNY = 11.53 INR)
  AED: 0.044217,  // 1 INR = 0.044217 AED (1 AED = 22.62 INR)
  SAR: 0.045181,  // 1 INR = 0.045181 SAR (1 SAR = 22.13 INR)
  SGD: 0.016145,  // 1 INR = 0.016145 SGD (1 SGD = 61.94 INR)
  HKD: 0.094146,  // 1 INR = 0.094146 HKD (1 HKD = 10.62 INR)
  NZD: 0.020024,  // 1 INR = 0.020024 NZD (1 NZD = 49.94 INR)
  MXN: 0.204819,  // 1 INR = 0.204819 MXN (1 MXN = 4.88 INR)
  BRL: 0.059639,  // 1 INR = 0.059639 BRL (1 BRL = 16.77 INR)
  ARS: 10.240964, // 1 INR = 10.240964 ARS (1 ARS = 0.098 INR)
  ZAR: 0.222892,  // 1 INR = 0.222892 ZAR (1 ZAR = 4.49 INR)
}

export interface CurrencyContextType {
  country: string
  currency: string
  setCountry: (country: string) => void
  convertPrice: (inrPrice: number) => number
  formatPrice: (inrPrice: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<string>('IN')
  const [isLoaded, setIsLoaded] = useState(false)

  // Load country from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCountry = localStorage.getItem('selectedCountry')
      if (savedCountry) {
        setCountryState(savedCountry)
      } else {
        // Try to detect country from browser
        const browserLocale = navigator.language || 'en-IN'
        const detectedCountry = browserLocale.split('-')[1]?.toUpperCase() || 'IN'
        if (COUNTRY_TO_CURRENCY[detectedCountry]) {
          setCountryState(detectedCountry)
        } else {
          // Default to India (INR) if detected country is not supported
          setCountryState('IN')
        }
      }
      setIsLoaded(true)
    }
  }, [])

  // Save country to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('selectedCountry', country)
    }
  }, [country, isLoaded])

  const currency = COUNTRY_TO_CURRENCY[country] || 'INR'

  const convertPrice = (inrPrice: number): number => {
    const rate = EXCHANGE_RATES[currency] || 1.0
    return inrPrice * rate
  }

  const formatPrice = (inrPrice: number): string => {
    const convertedPrice = convertPrice(inrPrice)
    const currencyCode = currency

    // Special formatting for currencies without decimals
    if (['JPY', 'KRW', 'VND'].includes(currencyCode)) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(convertedPrice)
    }

    // Standard formatting for other currencies
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedPrice)
  }

  const setCountry = (newCountry: string) => {
    setCountryState(newCountry)
  }

  return (
    <CurrencyContext.Provider
      value={{
        country,
        currency,
        setCountry,
        convertPrice,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
