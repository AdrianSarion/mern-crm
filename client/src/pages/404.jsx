import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, ArrowLeft, Home } from 'lucide-react'

export default function NotFoundError() {
  const navigate = useNavigate()
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-4'>
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 p-8 max-w-md w-full">
        <div className='flex flex-col items-center justify-center gap-4 text-center'>
          <div className="p-3 rounded-full bg-red-500/10">
            <AlertCircle className="h-12 w-12 text-red-400" />
          </div>
          <h1 className='text-7xl font-bold text-white'>404</h1>
          <span className='text-xl font-medium text-gray-300'>Oops! Page Not Found!</span>
          <p className='text-gray-400'>
            It seems like the page you&apos;re looking for <br />
            does not exist or might have been removed.
          </p>
          <div className='mt-6 flex gap-4'>
            <Button 
              variant='outline' 
              onClick={() => navigate(-1)}
              className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
