import { Button } from '@nextui-org/react'
import React from 'react'
import StyledCard from '../shared/StyledCard'
import { useFermiStore } from '@/stores/fermiStore'

type Props = {}

const CreateAccountBanner = (props: Props) => {
  const oo = useFermiStore(s => s.openOrders)
  
  return (
    <StyledCard>
      <div className="flex p-4 items-center justify-between">
        <div>
          <h6 className="font-bold text-lg">Create Account</h6>
          <p className="text-sm">
            Create an account to start trading
          </p>
        </div>
        <Button radius='sm' >
          Create
        </Button>
      </div>
    </StyledCard> 
  )
}

export default CreateAccountBanner