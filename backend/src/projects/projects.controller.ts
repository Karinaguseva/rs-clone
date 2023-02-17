import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from "express";
import { ProjectsService } from "./projects.service";
import { ApiHeader, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Project } from "./projects.model";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Task } from "../tasks/tasks.model";
import { CreateProjectDto } from "./dto/create-project.dto";

type ValidatedRequest = Request & {
  user: {
    id: number,
    email: string,
  }
}

@Controller('projects')
export class ProjectsController {
  constructor(
    private projectService: ProjectsService,
  ) {}

  @ApiOperation({ summary: 'Get User Projects' })
  @ApiHeader({
    name: 'Authorization',
    description: 'UserToken',
  })
  @ApiResponse({
    status: 200,
    type: [Project],
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  getUserProjects(@Req() req: ValidatedRequest) {
    return this.projectService.findUserProjects(req.user.id);
  }

  @ApiOperation({
    summary: 'Create Project'
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'User token',
  })
  @ApiResponse({
    status: 201,
    type: Task,
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  createPost(@Req() req: ValidatedRequest, @Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto, req.user.id);
  }
}