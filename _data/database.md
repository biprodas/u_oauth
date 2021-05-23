## users
```sql
CREATE TABLE users(
    
    id                      SERIAL NOT NULL,
    name                    VARCHAR(255),  
    username                VARCHAR(255), 
    password                VARCHAR(255),  
    -- email                   VARCHAR(255),  
    -- phone                   VARCHAR(255),  
    role                    VARCHAR(255),  
    status                  VARCHAR(255),

    "createdAt"              TIMESTAMP WITH TIME ZONE,
    "updatedAt"              TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT users_pkey PRIMARY KEY (id));
```

  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  uerId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: "User Id can not be null" }, 
      notEmpty: { msg: "User Id can not be empty" },
    }
  },
  token: sequelize.STRING,
  expiresIn: sequelize.DATE,
  revokedAt: sequelize.DATE,
  revokedByIp: sequelize.STRING,
  createdByIp: sequelize.STRING,
  replacedByToken: sequelize.STRING,

## totos
```sql
CREATE TABLE refresh_tokens(
   
    id              SERIAL NOT NULL,
    "userId"        INTEGER,
    token           VARCHAR(255),
    "expiresIn"       TIMESTAMP WITH TIME ZONE,
    "revokedAt"       TIMESTAMP WITH TIME ZONE,
    "revokedByIp"     VARCHAR(255),
    "createdByIp"     VARCHAR(255),
    "replacedByToken" VARCHAR(255),

    "createdAt"      TIMESTAMP WITH TIME ZONE,
    "updatedAt"      TIMESTAMP WITH TIME ZONE,

  CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id));
```