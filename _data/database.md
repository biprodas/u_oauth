## users
```sql
CREATE TABLE users(
    
    id                      SERIAL NOT NULL,
    name                    VARCHAR(255),  
    username                VARCHAR(255), 
    password                VARCHAR(255),  
    phone                   VARCHAR(255),  
    role                    VARCHAR(255),  
    status                  VARCHAR(255),

    createdAt              TIMESTAMP WITH TIME ZONE,
    updatedAt              TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT users_pkey PRIMARY KEY (id));
```

## totos
```sql
CREATE TABLE todos(
   
    id              SERIAL NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    status          VARCHAR(255),

    createdAt      TIMESTAMP WITH TIME ZONE,
    updatedAt      TIMESTAMP WITH TIME ZONE,

  CONSTRAINT projects_pkey PRIMARY KEY (id));
```