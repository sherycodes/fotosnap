import { cn } from 'cn';
import { Spinner } from '../ui/spinner';

const PageLoader = ({ className }: { className?: string }) => {
  return (
    <div className={cn('min-h-screen flex-center', className)}>
      <Spinner className='size-8' />
    </div>
  );
};

export default PageLoader;
