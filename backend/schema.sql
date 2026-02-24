--
-- PostgreSQL database dump
--

\restrict f4H8bJmcdGbBXLAKERUi5ZJDtOJUHq48elDPGc0Lfy1PkEcPTGGiGZlctgd9Hck

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: orgops_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO orgops_user;

--
-- Name: task_priority; Type: TYPE; Schema: public; Owner: orgops_user
--

CREATE TYPE public.task_priority AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);


ALTER TYPE public.task_priority OWNER TO orgops_user;

--
-- Name: task_status; Type: TYPE; Schema: public; Owner: orgops_user
--

CREATE TYPE public.task_status AS ENUM (
    'todo',
    'in_progress',
    'blocked',
    'done'
);


ALTER TYPE public.task_status OWNER TO orgops_user;

--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: orgops_user
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_updated_at() OWNER TO orgops_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: orgops_user
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    actor_user_id integer NOT NULL,
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.audit_logs OWNER TO orgops_user;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: orgops_user
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO orgops_user;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: orgops_user
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: membership; Type: TABLE; Schema: public; Owner: orgops_user
--

CREATE TABLE public.membership (
    membership_id integer NOT NULL,
    user_id integer NOT NULL,
    org_id integer NOT NULL,
    joined_date timestamp without time zone DEFAULT now(),
    role text NOT NULL,
    CONSTRAINT membership_role_check CHECK ((role = ANY (ARRAY['member'::text, 'admin'::text, 'owner'::text])))
);


ALTER TABLE public.membership OWNER TO orgops_user;

--
-- Name: membership_membership_id_seq; Type: SEQUENCE; Schema: public; Owner: orgops_user
--

CREATE SEQUENCE public.membership_membership_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.membership_membership_id_seq OWNER TO orgops_user;

--
-- Name: membership_membership_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: orgops_user
--

ALTER SEQUENCE public.membership_membership_id_seq OWNED BY public.membership.membership_id;


--
-- Name: orgs; Type: TABLE; Schema: public; Owner: orgops_user
--

CREATE TABLE public.orgs (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    deleted_by integer
);


ALTER TABLE public.orgs OWNER TO orgops_user;

--
-- Name: orgs_id_seq; Type: SEQUENCE; Schema: public; Owner: orgops_user
--

CREATE SEQUENCE public.orgs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orgs_id_seq OWNER TO orgops_user;

--
-- Name: orgs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: orgops_user
--

ALTER SEQUENCE public.orgs_id_seq OWNED BY public.orgs.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: orgops_user
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    org_id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by integer NOT NULL,
    archived_at timestamp with time zone
);


ALTER TABLE public.projects OWNER TO orgops_user;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: orgops_user
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO orgops_user;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: orgops_user
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: orgops_user
--

CREATE TABLE public.refresh_tokens (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    token_hash text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    revoked_at timestamp without time zone,
    replaced_by_token_id bigint
);


ALTER TABLE public.refresh_tokens OWNER TO orgops_user;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: orgops_user
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refresh_tokens_id_seq OWNER TO orgops_user;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: orgops_user
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: task_comments; Type: TABLE; Schema: public; Owner: orgops_user
--

CREATE TABLE public.task_comments (
    id integer NOT NULL,
    task_id integer NOT NULL,
    org_id integer NOT NULL,
    comment text NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    deleted_by integer
);


ALTER TABLE public.task_comments OWNER TO orgops_user;

--
-- Name: task_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: orgops_user
--

CREATE SEQUENCE public.task_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.task_comments_id_seq OWNER TO orgops_user;

--
-- Name: task_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: orgops_user
--

ALTER SEQUENCE public.task_comments_id_seq OWNED BY public.task_comments.id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: orgops_user
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    org_id integer NOT NULL,
    project_id integer NOT NULL,
    title text NOT NULL,
    description text,
    status public.task_status DEFAULT 'todo'::public.task_status NOT NULL,
    priority public.task_priority DEFAULT 'medium'::public.task_priority NOT NULL,
    assigned_to integer,
    created_by integer NOT NULL,
    due_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT tasks_title_not_empty CHECK ((length(TRIM(BOTH FROM title)) > 0))
);


ALTER TABLE public.tasks OWNER TO orgops_user;

--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: orgops_user
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tasks_id_seq OWNER TO orgops_user;

--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: orgops_user
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: user_credentials; Type: TABLE; Schema: public; Owner: orgops_user
--

CREATE TABLE public.user_credentials (
    user_id integer NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_credentials OWNER TO orgops_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: orgops_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    name text
);


ALTER TABLE public.users OWNER TO orgops_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: orgops_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO orgops_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: orgops_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: membership membership_id; Type: DEFAULT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.membership ALTER COLUMN membership_id SET DEFAULT nextval('public.membership_membership_id_seq'::regclass);


--
-- Name: orgs id; Type: DEFAULT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.orgs ALTER COLUMN id SET DEFAULT nextval('public.orgs_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: task_comments id; Type: DEFAULT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.task_comments ALTER COLUMN id SET DEFAULT nextval('public.task_comments_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: membership membership_pkey; Type: CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.membership
    ADD CONSTRAINT membership_pkey PRIMARY KEY (membership_id);


--
-- Name: membership membership_user_id_org_id_key; Type: CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.membership
    ADD CONSTRAINT membership_user_id_org_id_key UNIQUE (user_id, org_id);


--
-- Name: orgs orgs_pkey; Type: CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.orgs
    ADD CONSTRAINT orgs_pkey PRIMARY KEY (id);


--
-- Name: projects projects_org_id_name_unique; Type: CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_org_id_name_unique UNIQUE (org_id, name);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_hash_key UNIQUE (token_hash);


--
-- Name: task_comments task_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.task_comments
    ADD CONSTRAINT task_comments_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: user_credentials user_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.user_credentials
    ADD CONSTRAINT user_credentials_pkey PRIMARY KEY (user_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_projects_org_id; Type: INDEX; Schema: public; Owner: orgops_user
--

CREATE INDEX idx_projects_org_id ON public.projects USING btree (org_id);


--
-- Name: idx_refresh_tokens_user_id; Type: INDEX; Schema: public; Owner: orgops_user
--

CREATE INDEX idx_refresh_tokens_user_id ON public.refresh_tokens USING btree (user_id);


--
-- Name: idx_task_comments_task_created; Type: INDEX; Schema: public; Owner: orgops_user
--

CREATE INDEX idx_task_comments_task_created ON public.task_comments USING btree (task_id, created_at DESC);


--
-- Name: idx_tasks_assigned_to; Type: INDEX; Schema: public; Owner: orgops_user
--

CREATE INDEX idx_tasks_assigned_to ON public.tasks USING btree (assigned_to);


--
-- Name: idx_tasks_org_id; Type: INDEX; Schema: public; Owner: orgops_user
--

CREATE INDEX idx_tasks_org_id ON public.tasks USING btree (org_id);


--
-- Name: idx_tasks_project_created_at; Type: INDEX; Schema: public; Owner: orgops_user
--

CREATE INDEX idx_tasks_project_created_at ON public.tasks USING btree (project_id, created_at DESC);


--
-- Name: idx_tasks_project_id; Type: INDEX; Schema: public; Owner: orgops_user
--

CREATE INDEX idx_tasks_project_id ON public.tasks USING btree (project_id);


--
-- Name: one_owner_per_org; Type: INDEX; Schema: public; Owner: orgops_user
--

CREATE UNIQUE INDEX one_owner_per_org ON public.membership USING btree (org_id) WHERE (role = 'owner'::text);


--
-- Name: tasks trigger_set_updated_at; Type: TRIGGER; Schema: public; Owner: orgops_user
--

CREATE TRIGGER trigger_set_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: task_comments trigger_set_updated_at_comments; Type: TRIGGER; Schema: public; Owner: orgops_user
--

CREATE TRIGGER trigger_set_updated_at_comments BEFORE UPDATE ON public.task_comments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: membership membership_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.membership
    ADD CONSTRAINT membership_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.orgs(id) ON DELETE CASCADE;


--
-- Name: membership membership_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.membership
    ADD CONSTRAINT membership_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: orgs orgs_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.orgs
    ADD CONSTRAINT orgs_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id);


--
-- Name: projects projects_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: projects projects_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.orgs(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_replaced_by_token_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_replaced_by_token_id_fkey FOREIGN KEY (replaced_by_token_id) REFERENCES public.refresh_tokens(id);


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: task_comments task_comments_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.task_comments
    ADD CONSTRAINT task_comments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: task_comments task_comments_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.task_comments
    ADD CONSTRAINT task_comments_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id);


--
-- Name: task_comments task_comments_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.task_comments
    ADD CONSTRAINT task_comments_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.orgs(id) ON DELETE CASCADE;


--
-- Name: task_comments task_comments_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.task_comments
    ADD CONSTRAINT task_comments_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: tasks tasks_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: tasks tasks_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.orgs(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: user_credentials user_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orgops_user
--

ALTER TABLE ONLY public.user_credentials
    ADD CONSTRAINT user_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: orgops_user
--

ALTER DEFAULT PRIVILEGES FOR ROLE orgops_user IN SCHEMA public GRANT ALL ON TABLES TO orgops_user;


--
-- PostgreSQL database dump complete
--

\unrestrict f4H8bJmcdGbBXLAKERUi5ZJDtOJUHq48elDPGc0Lfy1PkEcPTGGiGZlctgd9Hck

