use std::ops::Deref;

pub struct BoxOneCallback<A, Return = ()>(Box<dyn Fn(A) -> Return + Send + Sync + 'static>);

impl<A, Return> BoxOneCallback<A, Return> {
    pub fn new<F>(f: F) -> Self
    where
        F: Fn(A) -> Return + Send + Sync + 'static,
    {
        Self(Box::new(f))
    }
}

impl<A, Return> Deref for BoxOneCallback<A, Return> {
    type Target = Box<dyn Fn(A) -> Return + Send + Sync + 'static>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl<F, A, Return> From<F> for BoxOneCallback<A, Return>
where
    F: Fn(A) -> Return + Send + Sync + 'static,
{
    fn from(value: F) -> Self {
        Self::new(value)
    }
}
